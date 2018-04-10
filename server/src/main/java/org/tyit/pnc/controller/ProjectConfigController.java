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
package org.tyit.pnc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.repository.DockerRepository;
import org.tyit.pnc.service.ProjectConfigService;
import org.tyit.pnc.utils.JwtUtils;

import javax.servlet.http.HttpServletRequest;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/project_config")
public class ProjectConfigController {

  private final DockerRepository dockerRepository;

  private final ProjectConfigService projectConfigService;

  @Autowired
  public ProjectConfigController(DockerRepository dockerRepository, ProjectConfigService projectConfigService) {
    this.dockerRepository = dockerRepository;
    this.projectConfigService = projectConfigService;
  }

  @GetMapping("/runcmds")
  public ResponseEntity<String> getRunCommands(HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      return ResponseEntity.ok(projectConfigService.getRunCommands(docker));
    } catch (Exception ex) {
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @GetMapping("/default_runcmds")
  public ResponseEntity<String> getPluginRunCommands(HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      return ResponseEntity.ok(projectConfigService.getPluginRunCommands(docker));
    } catch (Exception ex) {
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @PostMapping("/runcmds")
  public ResponseEntity<String> setRunCommands(HttpServletRequest request,
                                               @RequestParam("runcmds") String runcmds) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      projectConfigService.setRunCommands(docker, runcmds);
      return ResponseEntity.ok().build();
    } catch (Exception ex) {
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @GetMapping("/entrypoint")
  public ResponseEntity<String> getEntrypoint(HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      return ResponseEntity.ok(projectConfigService.getEntrypoint(docker));
    } catch (Exception ex) {
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @PostMapping("/entrypoint")
  public ResponseEntity<String> setEntrypoint(HttpServletRequest request,
                                              @RequestParam("entrypoint") String entrypoint) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      projectConfigService.setEntrypoint(docker, entrypoint);
      return ResponseEntity.ok().build();
    } catch (Exception ex) {
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  private Docker getDockerFromJti(String jti) throws Exception {
    Docker docker = dockerRepository.findOne(jti);
    if (docker == null) {
      throw new Exception("No project found in session");
    }
    return docker;
  }

}
