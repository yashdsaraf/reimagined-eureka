/*
 * Copyright 2018 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.tyit.pnc.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveOutputStream;
import org.apache.commons.compress.compressors.gzip.GzipCompressorOutputStream;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.model.PluginFile;
import org.tyit.pnc.model.Project;
import org.tyit.pnc.model.ProjectSettings;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.repository.PluginRepository;
import org.tyit.pnc.repository.ProjectRepository;
import org.tyit.pnc.utils.AmazonAWSUtils;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class CoreService {

  @Autowired
  private PluginRepository pluginRepository;

  @Autowired
  private ProjectRepository projectRepository;

  @Autowired
  private AppUserRepository appUserRepository;

  @Autowired
  private DockerService dockerService;

  @Value("${amazon.aws.s3.bucket}")
  private String BUCKET;

  @Value("${amazon.aws.s3.access_key}")
  private String ACCESS_KEY;

  @Value("${amazon.aws.s3.secret_key}")
  private String SECRET_KEY;

  private ObjectMapper mapper;

  public CoreService() {
    mapper = new ObjectMapper();
  }

  public String build(String token, String lang, String projectName, String entrypoint, String userName) throws Exception {
    Plugin plugin = pluginRepository.findByName(lang);
    if (plugin == null) {
      throw new Exception("No such plugin found");
    }
    Path tmpPath = Files.createTempDirectory(projectName);
    Path path = new File(tmpPath.toFile(), projectName).toPath();
    Files.createDirectory(path);
    AppUser user = appUserRepository.findByUsername(userName);
    Project project = new Project();
    project.setName(projectName);
    project.setUserId(user);
    ProjectSettings settings = new ProjectSettings(new String[0], entrypoint, new String[0], lang);
    project.setSettings(new ObjectMapper().writeValueAsString(settings));
    projectRepository.save(project);
    Docker docker = dockerService.build(token, path, plugin, project, user);
    // Update user_plugin table
    plugin.getAppUserCollection().add(user);
    pluginRepository.save(plugin);
    return new ObjectMapper().readValue(docker.getSettings(), PluginFile.class).getMode();
  }

  @SuppressWarnings("ConvertToTryWithResources")
  public Map<String, String> save(Docker docker) throws IOException, InterruptedException, ExecutionException {
    ProjectSettings settings = mapper.readValue(docker.getProjectId().getSettings(), ProjectSettings.class);
    byte[] settingsBytes = mapper.writerWithDefaultPrettyPrinter().writeValueAsBytes(settings);
    Files.write(new File(docker.getTmpDir(), ".plugncode").toPath(),
            settingsBytes,
            StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    String projectName = docker.getProjectId().getName();
    File tmpDir = Files.createTempDirectory(projectName).toFile();
    File file = new File(tmpDir, projectName + ".tgz");
    try (TarArchiveOutputStream stream
            = new TarArchiveOutputStream(
                    new GzipCompressorOutputStream(
                            new BufferedOutputStream(
                                    new FileOutputStream(file))))) {
      addToArchive(stream, docker.getTmpDir(), "");
    }
    String url = new AmazonAWSUtils(ACCESS_KEY, SECRET_KEY)
            .uploadFile(file, BUCKET, file.getName());
    FileUtils.deleteDirectory(tmpDir);
    if (url == null) {
      throw new IOException("An error occurred while uploading file to AWS");
    }
    Map<String, String> map = new HashMap<>();
    map.put("name", projectName + ".tgz");
    map.put("url", url);
    return map;
  }

  private void addToArchive(TarArchiveOutputStream stream, String path, String base) throws IOException {
    File file = new File(path);
    System.out.println(file.exists());
    String entryName = base + file.getName();
    TarArchiveEntry tarEntry = new TarArchiveEntry(file, entryName);
    stream.putArchiveEntry(tarEntry);

    if (file.isFile()) {
      IOUtils.copy(new FileInputStream(file), stream);
      stream.closeArchiveEntry();
      return;
    }
    stream.closeArchiveEntry();
    File[] children = file.listFiles();
    if (children != null) {
      for (File child : children) {
        if (child.getName().equalsIgnoreCase("start.sh") && base.isEmpty()) {
          continue;
        }
        System.out.println(child.getName());
        addToArchive(stream, child.getAbsolutePath(), entryName + "/");
      }
    }
  }

}
