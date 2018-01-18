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
package org.tyit.pnc.utils;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.file.Path;
import java.security.SecureRandom;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
public class DockerUtils {

  public static long buildDockerImage(Path tempDir) throws IOException, Exception {
    long imageId = new SecureRandom().nextLong();
    String[] commands = {
      "docker",
      "build",
      "-t",
      String.valueOf(imageId),
      "."
    };
    Process process = Runtime.getRuntime().exec(commands, null, tempDir.toFile());
    if (process.waitFor() != 0) {
      StringBuilder sb = new StringBuilder();
      new BufferedReader(new InputStreamReader(process.getErrorStream())).lines().forEach(sb::append);
      throw new Exception(sb.toString());
    }
    return imageId;
  }

}
