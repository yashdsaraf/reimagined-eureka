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

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.model.Project;
import org.tyit.pnc.model.ProjectSettings;
import org.tyit.pnc.repository.DockerRepository;
import org.tyit.pnc.repository.ProjectRepository;
import org.tyit.pnc.service.FileExService;
import org.tyit.pnc.utils.JwtUtils;

import javax.servlet.http.HttpServletRequest;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/file-ex")
public class FileExController {

  private final FileExService fileExService;

  private final DockerRepository dockerRepository;

  private final ProjectRepository projectRepository;

  @Autowired
  public FileExController(FileExService fileExService, DockerRepository dockerRepository, ProjectRepository projectRepository) {
    this.fileExService = fileExService;
    this.dockerRepository = dockerRepository;
    this.projectRepository = projectRepository;
  }

  @GetMapping
  public ResponseEntity<String> getFileTree(HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      return ResponseEntity.ok(fileExService.getFileTree(docker.getTmpDir()));
    } catch (Exception ex) {
      Logger.getLogger(FileExController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @GetMapping("/file")
  public ResponseEntity<String> getFile(HttpServletRequest request,
                                        @RequestParam("file") String fileName,
                                        @RequestParam("parent") String parent) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      return ResponseEntity.ok(fileExService.getFile(docker.getTmpDir(), fileName, parent));
    } catch (Exception ex) {
      Logger.getLogger(FileExController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @PostMapping
  public ResponseEntity<String> create(HttpServletRequest request,
                                       @RequestParam("file") String fileName,
                                       @RequestParam("parent") String parent,
                                       @RequestParam("isDir") boolean isDir) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      fileExService.create(docker.getTmpDir(), fileName, parent, isDir);
    } catch (Exception ex) {
      Logger.getLogger(FileExController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    return ResponseEntity.ok().build();
  }

  @DeleteMapping
  public ResponseEntity<String> delete(HttpServletRequest request,
                                       @RequestParam("file") String fileName,
                                       @RequestParam("parent") String parent) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      fileExService.delete(docker.getTmpDir(), fileName, parent);
    } catch (Exception ex) {
      Logger.getLogger(FileExController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    return ResponseEntity.ok().build();
  }

  @PostMapping("/rename")
  public ResponseEntity<String> rename(HttpServletRequest request,
                                       @RequestParam("file") String filename,
                                       @RequestParam("parent") String parent,
                                       @RequestParam("newname") String newname) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      Project project = docker.getProjectId();
      ObjectMapper mapper = new ObjectMapper();
      ProjectSettings projectSettings = mapper
              .readValue(project.getSettings(), ProjectSettings.class);
      ProjectSettings updatedProjectSettings = fileExService
              .rename(docker.getTmpDir(), projectSettings, filename, parent, newname);
      project.setSettings(mapper.writeValueAsString(updatedProjectSettings));
      projectRepository.save(project);
    } catch (Exception ex) {
      Logger.getLogger(FileExController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    return ResponseEntity.ok().build();
  }

  @PostMapping("/move")
  public ResponseEntity<String> move(HttpServletRequest request,
                                     @RequestParam("file") String filename,
                                     @RequestParam("oldparent") String oldParent,
                                     @RequestParam("newparent") String newParent) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      fileExService.copy(docker.getTmpDir(), filename, oldParent, newParent, true);
    } catch (Exception ex) {
      Logger.getLogger(FileExController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    return ResponseEntity.ok().build();
  }

  @PostMapping("/copy")
  public ResponseEntity<String> copy(HttpServletRequest request,
                                     @RequestParam("file") String filename,
                                     @RequestParam("oldparent") String oldParent,
                                     @RequestParam("newparent") String newParent) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      fileExService.copy(docker.getTmpDir(), filename, oldParent, newParent, false);
    } catch (Exception ex) {
      Logger.getLogger(FileExController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    return ResponseEntity.ok().build();
  }

  private Docker getDockerFromJti(String jti) throws Exception {
    Docker docker = dockerRepository.findOne(jti);
    if (docker == null) {
      throw new Exception("No project found in session");
    }
    return docker;
  }

}
