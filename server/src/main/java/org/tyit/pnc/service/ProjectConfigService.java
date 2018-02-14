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
import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.model.PluginFile;
import org.tyit.pnc.model.Project;
import org.tyit.pnc.model.ProjectSettings;
import org.tyit.pnc.repository.ProjectRepository;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class ProjectConfigService {

  @Autowired
  private ProjectRepository projectRepository;

  ObjectMapper mapper;

  public ProjectConfigService() {
    mapper = new ObjectMapper();
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

  public void setRunCommands(Docker docker, String runcmds) throws IOException {
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

  public void setEntrypoint(Docker docker, String entrypoint) throws IOException {
    Project project = docker.getProjectId();
    ProjectSettings settings = mapper.readValue(project.getSettings(), ProjectSettings.class);
    settings.setEntrypoint(entrypoint);
    project.setSettings(mapper.writeValueAsString(settings));
    projectRepository.save(project);
  }

}
