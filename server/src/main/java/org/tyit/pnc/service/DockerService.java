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

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.repository.DockerRepository;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class DockerService {

  @Autowired
  private DockerRepository dockerRepository;

  public Docker build(Path tempDir, String dockerFileContent, AppUser user) throws IOException {
    File dockerFile = new File(tempDir.toFile(), "Dockerfile");
    Files.write(dockerFile.toPath(), Base64.getDecoder().decode(dockerFileContent), StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
    Docker docker = new Docker();
    docker.setSettings(dockerFileContent);
    docker.setUserId(user);
    dockerRepository.save(docker);
    return docker;
  }

}
