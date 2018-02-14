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
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.model.Output;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.model.PluginFile;
import org.tyit.pnc.model.Project;
import org.tyit.pnc.model.ProjectSettings;
import org.tyit.pnc.repository.DockerRepository;
import org.tyit.pnc.utils.DockerUtils;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class DockerService {

  @Autowired
  private DockerRepository dockerRepository;

  private DockerUtils dockerUtils;

  public DockerService() {
    try {
      dockerUtils = new DockerUtils();
    } catch (Exception ex) {
      Logger.getLogger(DockerService.class.getName()).log(Level.SEVERE, null, ex);
    }
  }

  public Output execute(String token, Map<String, String> code) throws Exception {
    Docker docker = dockerRepository.findOne(token);
    if (docker == null) {
      throw new Exception("No project found in session");
    }
    code.forEach((path, content) -> {
      Path realPath = Paths.get(docker.getTmpDir(), path);
      try {
        Files.write(realPath, content.getBytes(StandardCharsets.UTF_8),
                StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
      } catch (IOException ex) {
        Logger.getLogger(DockerService.class.getName()).log(Level.SEVERE, null, ex);
      }
    });
    return dockerUtils.runDockerImage(docker);
  }

  public Docker build(String token, Path tempDir, Plugin plugin, Project project, AppUser user) throws IOException, Exception {
    String pluginSettings = plugin.getPluginFile();
    String projectSettings = project.getSettings();
    ObjectMapper mapper = new ObjectMapper();
    PluginFile pluginFile = mapper.readValue(pluginSettings, PluginFile.class);
    ProjectSettings settings = mapper.readValue(projectSettings, ProjectSettings.class);
    File dockerFile = new File(tempDir.toFile(), "Dockerfile");
    Files.write(dockerFile.toPath(), pluginFile.getDockerfile()
            .getBytes(StandardCharsets.UTF_8),
            StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
    File entryPoint = new File(tempDir.toFile(), settings.getEntrypoint());
    Files.createFile(entryPoint.toPath());
    dockerUtils.writeStarterScript(tempDir, pluginFile, settings);
    Docker docker = new Docker();
    docker.setSettings(pluginSettings);
    docker.setUserId(user);
    long imageId = dockerUtils.buildDockerImage(tempDir.toAbsolutePath());
    docker.setImageId(imageId);
    docker.setId(token);
    docker.setTmpDir(tempDir.toAbsolutePath().toString());
    docker.setPluginId(plugin);
    docker.setProjectId(project);
    dockerRepository.save(docker);
    return docker;
  }

}
