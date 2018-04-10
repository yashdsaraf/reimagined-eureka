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

import org.apache.commons.io.FileDeleteStrategy;
import org.apache.commons.io.FilenameUtils;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.model.Output;
import org.tyit.pnc.model.PluginFile;
import org.tyit.pnc.model.ProjectSettings;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Arrays;
import java.util.StringJoiner;
import java.util.concurrent.ThreadLocalRandom;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
public class DockerUtils {

  private static final String MACHINE_NAME = "plugncode";
  private String[] envVars;

  public DockerUtils() throws Exception {
    String command = "docker-machine env " + MACHINE_NAME;
    Process process = Runtime.getRuntime().exec(command);
    if (process.waitFor() != 0) {
      throw new Exception(getStringFromBuffer(process.getErrorStream(), " "));
    }
    envVars = getBufferFromStream(process.getInputStream())
            .lines()
            .filter(i -> i.startsWith("SET "))
            .map(i -> i.substring(4))
            .toArray(String[]::new);
  }

  public long buildDockerImage(Path tempDir) throws Exception {
    long imageId = ThreadLocalRandom.current().nextLong(100000000, 999999999); //Generates a 64 bit random number
    String[] commands = {
            "docker",
            "build",
            "-t",
            String.valueOf(imageId),
            "."
    };
    Process process = Runtime.getRuntime().exec(commands, envVars, tempDir.toFile());
    System.out.println(Arrays.toString(commands));
    if (process.waitFor() != 0) {
      throw new Exception(getStringFromBuffer(process.getErrorStream(), " "));
    }
    return imageId;
  }

  /**
   * Creates a starter script called 'start.sh' in the current project directory
   * using 'runCmd' property from .settings file, if found, or from plugin file.
   */
  public void writeStarterScript(Path tmpDir, PluginFile pluginFile, ProjectSettings settings) throws IOException {
    StringJoiner stringJoiner = new StringJoiner("\n");
    stringJoiner.add("filename=\"" + settings.getEntrypoint() + "\"");
    stringJoiner.add("basename=\"" + FilenameUtils.getBaseName(settings.getEntrypoint()) + "\"");
    String[] lines;
    if (settings.getRunCmd().length > 0) {
      lines = settings.getRunCmd();
    } else {
      lines = pluginFile.getRunCmd();
    }
    Arrays.asList(lines).forEach(stringJoiner::add);
    stringJoiner.add("");
    File starterScript = new File(tmpDir.toFile(), "start.sh");
    Files.write(starterScript.toPath(), stringJoiner.toString().getBytes(StandardCharsets.UTF_8),
            StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
  }

  public Output runDockerImage(Docker docker) throws Exception {
    String mountDir = GeneralUtils.getInstance().getUnixPath(docker.getTmpDir());
    String[] commands = {
            "docker",
            "run",
            "--rm",
            "-v",
            mountDir + ":/usr/src/app",
            String.valueOf(docker.getImageId())
    };
    Process process = Runtime.getRuntime().exec(commands, envVars, new File(docker.getTmpDir()));
    System.out.println(Arrays.toString(commands));
    Output output = new Output();
    String delimiter = System.lineSeparator();
    output.setStderr(getStringFromBuffer(process.getErrorStream(), delimiter));
    output.setStdout(getStringFromBuffer(process.getInputStream(), delimiter));
    return output;
  }

  public void deleteDockerImage(Docker docker) throws Exception {
    File tmpDir = new File(docker.getTmpDir());
    new Thread(() -> {
      while (tmpDir.exists()) {
        try {
          Thread.sleep(15000);
          FileDeleteStrategy.FORCE.delete(tmpDir);
        } catch (IOException | InterruptedException ex) {
          continue;
        }
        break;
      }
    }).start();
    String[] commands = {
            "docker",
            "rmi",
            "-f",
            String.valueOf(docker.getImageId())
    };
    Process process = Runtime.getRuntime().exec(commands, envVars);
    System.out.println(Arrays.toString(commands));
    if (process.waitFor() != 0) {
      throw new Exception(getStringFromBuffer(process.getErrorStream(), " "));
    }
  }

  private BufferedReader getBufferFromStream(InputStream inputStream) {
    return new BufferedReader(new InputStreamReader(inputStream));
  }

  private String getStringFromBuffer(InputStream inputStream, String delimiter) {
    StringJoiner joiner = new StringJoiner(delimiter);
    getBufferFromStream(inputStream).lines().forEach(joiner::add);
    return joiner.toString();
  }

}
