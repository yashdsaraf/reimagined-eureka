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
package org.tyit.pnc.model;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
public class ProjectSettings {

  private String[] runCmd;
  private String entrypoint;
  private String[] saveas;
  private String plugin;

  public ProjectSettings() {
  }

  public ProjectSettings(String[] runCmd, String entrypoint, String[] saveas, String plugin) {
    this.runCmd = runCmd;
    this.entrypoint = entrypoint;
    this.saveas = saveas;
    this.plugin = plugin;
  }

  public String[] getRunCmd() {
    return runCmd;
  }

  public void setRunCmd(String[] runCmd) {
    this.runCmd = runCmd;
  }

  public String getEntrypoint() {
    return entrypoint;
  }

  public void setEntrypoint(String entrypoint) {
    this.entrypoint = entrypoint;
  }

  public String[] getSaveas() {
    return saveas;
  }

  public void setSaveas(String[] saveas) {
    this.saveas = saveas;
  }

  public String getPlugin() {
    return plugin;
  }

  public void setPlugin(String plugin) {
    this.plugin = plugin;
  }

}
