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

import java.security.Principal;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.model.Output;
import org.tyit.pnc.service.CoreService;
import org.tyit.pnc.service.DockerService;
import org.tyit.pnc.utils.JwtUtils;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/project")
public class ProjectController {

  @Autowired
  private CoreService coreService;

  @Autowired
  private DockerService dockerService;

  @GetMapping
  public ResponseEntity<String> isProjectInSession(HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = dockerService.check(jti);
      return ResponseEntity.ok(docker.getPluginId().getName());
    } catch (Exception ex) {
      Logger.getLogger(ProjectController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @GetMapping("/create")
  public ResponseEntity<String> createProject(@RequestParam("plugin") String lang,
          @RequestParam("project") String projectName,
          @RequestParam("entrypoint") String entrypoint,
          Principal principal,
          HttpServletRequest request,
          Authentication authentication) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      String mode = coreService.build(jti, lang, projectName, entrypoint, principal.getName());
      return ResponseEntity.ok(mode);
    } catch (Exception ex) {
      Logger.getLogger(ProjectController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @PostMapping("/run")
  public ResponseEntity<Output> runProject(@RequestParam Map<String, String> code, HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Output output = dockerService.execute(jti, code);
      return ResponseEntity.ok(output);
    } catch (Exception ex) {
      Logger.getLogger(ProjectController.class.getName()).log(Level.SEVERE, null, ex);
      return ResponseEntity.badRequest().build();
    }
  }

  @DeleteMapping("/delete")
  public ResponseEntity<String> deleteProjectFromSession(HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      dockerService.delete(jti);
      return ResponseEntity.ok().build();
    } catch (Exception ex) {
      Logger.getLogger(ProjectController.class.getName()).log(Level.SEVERE, null, ex);
      return ResponseEntity.badRequest().build();
    }
  }

  @GetMapping("/save")
  public ResponseEntity<Map> saveProject(HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      return ResponseEntity.ok(coreService.save(dockerService.check(jti)));
    } catch (Exception ex) {
      Logger.getLogger(ProjectController.class.getName()).log(Level.SEVERE, null, ex);
      return ResponseEntity.badRequest().build();
    }
  }

}
