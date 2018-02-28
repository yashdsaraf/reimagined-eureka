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
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ExecutionException;
import java.util.zip.GZIPInputStream;
import org.apache.commons.compress.archivers.ArchiveException;
import org.apache.commons.compress.archivers.ArchiveStreamFactory;
import org.apache.commons.compress.archivers.tar.TarArchiveEntry;
import org.apache.commons.compress.archivers.tar.TarArchiveInputStream;
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
    UUID uuid = UUID.randomUUID();
    Project project = new Project();
    project.setName(projectName);
    project.setUuid(uuid.toString());
    project.setUserId(user);
    ProjectSettings settings = new ProjectSettings(uuid.toString(), new String[0], entrypoint, new String[0], lang);
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
                            new FileOutputStream(file)))) {
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

  public void open(String jti, String link, String userName) throws IOException, ArchiveException, Exception {
    Path projectDir = Paths.get(validateAndExtract(jti, link));
    File[] files = projectDir.toFile().listFiles((File dir, String name) -> name.equalsIgnoreCase(".plugncode"));
    if (files.length < 1) {
      throw new IOException("No settings file found in project");
    }
    File settingsFile = files[0];
    byte[] content = Files.readAllBytes(settingsFile.toPath());
    ProjectSettings settings = mapper.readValue(content, ProjectSettings.class);
    Project project = projectRepository.findByUuid(settings.getUuid());
    if (project == null) {
      throw new Exception("No such project found in database");
    }
    Plugin plugin = pluginRepository.findByName(settings.getPlugin());
    if (plugin == null) {
      throw new Exception("Invalid plugin found in project");
    }
    Path tmpPath = Files.createTempDirectory(project.getName());
    Path path = new File(tmpPath.toFile(), project.getName()).toPath();
    AppUser user = appUserRepository.findByUsername(userName);
    Files.createDirectory(path);
    dockerService.build(jti, path, plugin, project, user);
  }

  public String validateAndExtract(String jti, String link) throws IOException, ArchiveException {
    Path tmpDir = Files.createTempDirectory(jti);
    File inputFile = new File(tmpDir.toFile(), "project.tgz");
    File outputTar = new File(tmpDir.toFile(), "project.tar");
    FileUtils.copyURLToFile(new URL(link), inputFile);
    try (GZIPInputStream gzipIn = new GZIPInputStream(new FileInputStream(inputFile));
            FileOutputStream outStream = new FileOutputStream(outputTar)) {
      IOUtils.copy(gzipIn, outStream);
    }
    try (TarArchiveInputStream tarIn = (TarArchiveInputStream) new ArchiveStreamFactory()
            .createArchiveInputStream(new FileInputStream(outputTar))) {
      TarArchiveEntry entry;
      while ((entry = (TarArchiveEntry) tarIn.getNextEntry()) != null) {
        final File outputFile = new File(tmpDir.toFile(), entry.getName());
        if (entry.isDirectory()) {
          if (!outputFile.exists()) {
            if (!outputFile.mkdirs()) {
              throw new IllegalStateException(String.format("Couldn't create directory %s.", outputFile.getAbsolutePath()));
            }
          }
        } else {
          try (FileOutputStream outputFileStream = new FileOutputStream(outputFile)) {
            IOUtils.copy(tarIn, outputFileStream);
          }
        }
      }
    }
    return tmpDir.toAbsolutePath().toString();
  }

  public void createProjectFromTgz(String jti, String link, String lang, String projectName, String entrypoint, String name) {
    throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
  }

}
