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
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.model.Output;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.model.PluginFile;
import org.tyit.pnc.model.Project;
import org.tyit.pnc.model.ProjectSettings;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.repository.PluginRepository;
import org.tyit.pnc.repository.ProjectRepository;

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

  public Output execute(String token, Map<String, String> code) throws Exception {
    return dockerService.execute(token, code);
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
    Docker docker = dockerService.build(token, path, plugin.getPluginFile(), project.getSettings(), user);
    return new ObjectMapper().readValue(docker.getSettings(), PluginFile.class).getMode();
  }

}
