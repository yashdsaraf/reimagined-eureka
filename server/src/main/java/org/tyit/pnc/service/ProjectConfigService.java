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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.*;
import org.tyit.pnc.repository.ProjectRepository;

import java.io.IOException;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class ProjectConfigService {

  private final ProjectRepository projectRepository;
  private ObjectMapper mapper;

  @Autowired
  public ProjectConfigService(ProjectRepository projectRepository) {
    mapper = new ObjectMapper();
    this.projectRepository = projectRepository;
  }

  public String getRunCommands(Docker docker) throws IOException {
    Plugin plugin = docker.getPluginId();
    Project project = docker.getProjectId();
    ProjectSettings settings = mapper.readValue(project.getSettings(), ProjectSettings.class);
    PluginFile pluginFile = mapper.readValue(plugin.getPluginFile(), PluginFile.class);
    if (settings.getRunCmd() != null && settings.getRunCmd().length > 0) {
      return mapper.writeValueAsString(settings.getRunCmd());
    }
    return mapper.writeValueAsString(pluginFile.getRunCmd());
  }

  public String getPluginRunCommands(Docker docker) throws IOException {
    Plugin plugin = docker.getPluginId();
    PluginFile pluginFile = mapper.readValue(plugin.getPluginFile(), PluginFile.class);
    return mapper.writeValueAsString(pluginFile.getRunCmd());
  }

  public void setRunCommands(Docker docker, String runcmds) throws Exception {
    String[] runCmdsArr = mapper.readValue(runcmds, String[].class);
    Project project = docker.getProjectId();
    ProjectSettings settings = mapper.readValue(project.getSettings(), ProjectSettings.class);
    settings.setRunCmd(runCmdsArr);
    project.setSettings(mapper.writeValueAsString(settings));
    projectRepository.save(project);
  }

  public String getEntrypoint(Docker docker) throws IOException {
    Project project = docker.getProjectId();
    ProjectSettings settings = mapper.readValue(project.getSettings(), ProjectSettings.class);
    return mapper.writeValueAsString(settings.getEntrypoint());
  }

  public void setEntrypoint(Docker docker, String entrypoint) throws Exception {
    Project project = docker.getProjectId();
    ProjectSettings settings = mapper.readValue(project.getSettings(), ProjectSettings.class);
    settings.setEntrypoint(entrypoint);
    project.setSettings(mapper.writeValueAsString(settings));
    projectRepository.save(project);
  }

}
