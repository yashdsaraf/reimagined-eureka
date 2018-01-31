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

import java.nio.charset.StandardCharsets;
import java.util.Base64;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
public class PluginFile {

  private String[] runCmd;
  private String dockerfile;
  private String mode;

  public String[] getRunCmd() {
    return runCmd;
  }

  public void setRunCmd(String[] runCmd) {
    this.runCmd = runCmd;
  }

  public String getDockerfile() {
    return new String(Base64.getDecoder().decode(dockerfile));
  }

  public void setDockerFile(String dockerfile) {
    this.dockerfile = Base64.getEncoder().encodeToString(dockerfile.getBytes(StandardCharsets.UTF_8));
  }

  public String getMode() {
    return mode;
  }

  public void setMode(String mode) {
    this.mode = mode;
  }

}
