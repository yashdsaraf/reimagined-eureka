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
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;
import java.util.StringJoiner;
import java.util.concurrent.ThreadLocalRandom;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.model.Output;
import org.tyit.pnc.model.PluginFile;
import org.tyit.pnc.model.ProjectSettings;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
public class DockerUtils {

  public static long buildDockerImage(Path tempDir) throws IOException, InterruptedException, Exception {
    long imageId = ThreadLocalRandom.current().nextLong(100000000, 999999999); //Generates a 64 bit random number
    String[] commands = {
      "docker",
      "build",
      "-t",
      String.valueOf(imageId),
      "."
    };
    Process process = Runtime.getRuntime().exec(commands, null, tempDir.toFile());
    if (process.waitFor() != 0) {
      StringJoiner joiner = new StringJoiner(" ");
      new BufferedReader(new InputStreamReader(process.getErrorStream())).lines().forEach(joiner::add);
      throw new Exception(joiner.toString());
    }
    return imageId;
  }

  /**
   * Creates a starter script called 'start.sh' in the current project directory
   * using 'runCmd' property from .settings file, if found, or from plugin file.
   *
   * @param tmpDir
   * @param pluginFile
   * @param settings
   * @throws IOException
   */
  public static void writeStarterScript(Path tmpDir, PluginFile pluginFile, ProjectSettings settings) throws IOException {
    StringJoiner stringJoiner = new StringJoiner("\n");
    stringJoiner.add("file=\"" + settings.getEntrypoint() + "\"");
    String[] lines;
    if (settings.getRunCmd().length > 0) {
      lines = settings.getRunCmd();
    } else {
      lines = pluginFile.getRunCmd();
    }
    Arrays.asList(lines).forEach(line -> {
      stringJoiner.add(line);
    });
    stringJoiner.add("");
    File starterScript = new File(tmpDir.toFile(), "start.sh");
    Files.write(starterScript.toPath(), stringJoiner.toString().getBytes(StandardCharsets.UTF_8),
            StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
  }

  public static Output runDockerImage(Path tmpDir, Docker docker) throws IOException, Exception {
    String[] commands = {
      "docker",
      "run",
      "-v",
      tmpDir.toString() + ":/usr/src/app",
      String.valueOf(docker.getImageId())
    };
    Process process = Runtime.getRuntime().exec(commands, null, tmpDir.toFile());
    BufferedReader errorStream = new BufferedReader(new InputStreamReader(process.getErrorStream()));
    BufferedReader inputStream = new BufferedReader(new InputStreamReader(process.getInputStream()));
    Output output = new Output();
    StringJoiner joiner = new StringJoiner(System.lineSeparator());
    errorStream.lines().forEach(joiner::add);
    output.setStderr(joiner.toString());
    joiner = new StringJoiner(System.lineSeparator());
    inputStream.lines().forEach(joiner::add);
    output.setStdout(joiner.toString());
    return output;
  }

}
