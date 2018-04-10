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
import java.nio.file.Paths;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.model.Project;
import org.tyit.pnc.model.ProjectSettings;
import org.tyit.pnc.repository.PluginRepository;
import org.tyit.pnc.repository.ProjectRepository;
import org.tyit.pnc.utils.DockerUtils;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class PluginService {

  private final CoreService coreService;
  private final ProjectRepository projectRepository;
  private final PluginRepository pluginRepository;
  private ObjectMapper mapper;

  @Autowired
  public PluginService(CoreService coreService, ProjectRepository projectRepository, PluginRepository pluginRepository) {
    mapper = new ObjectMapper();
    this.coreService = coreService;
    this.projectRepository = projectRepository;
    this.pluginRepository = pluginRepository;
  }

  public void install(Docker docker, String pluginName) throws Exception {
    Project project = docker.getProjectId();
    Plugin plugin = pluginRepository.findByName(pluginName);
    if (plugin == null) {
      throw new Exception("No such plugin found");
    }
    if (plugin == docker.getPluginId()) {
      throw new Exception("Plugin already installed");
    }
    ProjectSettings settings = mapper.readValue(project.getSettings(), ProjectSettings.class);
    settings.setPlugin(pluginName);
    settings.setRunCmd(new String[0]);
    project.setSettings(mapper.writeValueAsString(settings));
    projectRepository.save(project);
    // Recreate docker image to work with the newly applied plugin
    DockerUtils dockerUtils = new DockerUtils();
    dockerUtils.deleteDockerImage(docker);
    coreService.buildProject(docker.getId(), pluginName, project.getName(), settings.getEntrypoint(), docker.getUserId().getUsername(), Paths.get(docker.getTmpDir()));
  }

  public Iterable<Plugin> getPlugins(String name) {
    Iterable<Plugin> plugins;
    if (name != null && !name.isEmpty()) {
      plugins = pluginRepository.findAllApprovedByName(name);
    } else {
      plugins = pluginRepository.findAllApproved();
    }
    return plugins;
  }

}
