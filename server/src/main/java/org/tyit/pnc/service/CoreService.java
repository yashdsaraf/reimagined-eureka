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
import org.springframework.web.multipart.MultipartFile;
import org.tyit.pnc.model.*;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.repository.PluginRepository;
import org.tyit.pnc.repository.ProjectRepository;
import org.tyit.pnc.utils.AmazonAWSUtils;

import java.io.*;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.*;
import java.util.zip.GZIPInputStream;

/**
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
    return buildProject(token, lang, projectName, entrypoint, userName, null);
  }

  private String buildProject(String token, String lang, String projectName, String entrypoint, String userName, Path basePath) throws Exception {
    Plugin plugin = pluginRepository.findByName(lang);
    if (plugin == null) {
      throw new Exception("No such plugin found");
    }
    Path tmpPath = basePath == null ? Files.createTempDirectory(projectName) : basePath;
    Path path = new File(tmpPath.toFile(), projectName).toPath();
    Files.createDirectory(path);
    AppUser user = appUserRepository.findByUsername(userName);
    UUID uuid = UUID.randomUUID();
    Project project = new Project();
    project.setName(projectName);
    project.setUuid(uuid.toString());
    project.setUserId(user);
    ProjectSettings settings = new ProjectSettings(uuid.toString(), new String[0], entrypoint, new String[0], lang);
    project.setSettings(mapper.writeValueAsString(settings));
    projectRepository.save(project);
    Docker docker = dockerService.build(token, path, plugin, project, user);
    // Update user_plugin table
    plugin.getAppUserCollection().add(user);
    pluginRepository.save(plugin);
    return mapper.readValue(docker.getSettings(), PluginFile.class).getMode();
  }

  public Map<String, String> save(Docker docker) throws IOException {
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

  public String open(String jti, Path projectDir, String userName) throws IOException, ArchiveException, Exception {
    Optional<Path> first = Files.find(projectDir, 2, (path, basicFileAttributes) -> path.getFileName()
            .toString()
            .equalsIgnoreCase(".plugncode"))
            .findFirst();
    if (!first.isPresent()) {
      throw new IOException("No settings file found in project");
    }
    File settingsFile = first.get().toFile();
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
    Docker docker = dockerService.build(jti, path, plugin, project, user);
    return mapper.readValue(docker.getSettings(), PluginFile.class).getMode();
  }

  public String createProjectFromExistingSources(String jti, Path projectDir, String lang, String projectName, String entrypoint, String userName) throws Exception {
    return buildProject(jti, lang, projectName, entrypoint, userName, projectDir);
  }

  public Path validateAndExtractFromLink(String jti, String link) throws IOException, ArchiveException {
    Path tmpDir = Files.createTempDirectory(Base64.getEncoder().encodeToString(jti.getBytes()));
    File inputFile = new File(tmpDir.toFile(), "project.tgz");
    FileUtils.copyURLToFile(new URL(link), inputFile);
    return validateAndExtract(inputFile, tmpDir);
  }

  public Path validateAndExtractFromFile(String jti, MultipartFile file) throws IOException, ArchiveException {
    Path tmpDir = Files.createTempDirectory(Base64.getEncoder().encodeToString(jti.getBytes()));
    File inputFile = new File(tmpDir.toFile(), "project.tgz");
    Files.write(inputFile.toPath(), file.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
    return validateAndExtract(inputFile, tmpDir);
  }

  private Path validateAndExtract(File inputFile, Path tmpDir) throws IOException, ArchiveException {
    File outputTar = new File(tmpDir.toFile(), "project.tar");
    try (GZIPInputStream gzipIn = new GZIPInputStream(new FileInputStream(inputFile));
         FileOutputStream outStream = new FileOutputStream(outputTar)) {
      IOUtils.copy(gzipIn, outStream);
    }
    try (TarArchiveInputStream tarIn = (TarArchiveInputStream) new ArchiveStreamFactory()
            .createArchiveInputStream(new BufferedInputStream(new FileInputStream(outputTar)))) {
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
    return tmpDir.toAbsolutePath();
  }

}
