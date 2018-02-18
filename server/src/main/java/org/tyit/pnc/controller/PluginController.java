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

import java.util.logging.Level;
import java.util.logging.Logger;

import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.tyit.pnc.model.Docker;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.repository.DockerRepository;
import org.tyit.pnc.service.AdminService;
import org.tyit.pnc.service.PluginService;
import org.tyit.pnc.utils.JwtUtils;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/plugins")
public class PluginController {

  @Autowired
  private AdminService adminService;

  @Autowired
  private DockerRepository dockerRepository;

  @Autowired
  private PluginService pluginService;

  @GetMapping
  public ResponseEntity<Iterable<Plugin>> getPlugins(@RequestParam(name = "name", required = false) String name) {
    return ResponseEntity.ok(adminService.getPlugins(name));
  }

  @PostMapping
  public ResponseEntity<String> installPlugin(
          @RequestParam("name") String name,
          HttpServletRequest request) {
    String accessToken = request.getHeader("Authorization").split(" ")[1];
    try {
      String jti = JwtUtils.getInstance().getJti(accessToken);
      Docker docker = getDockerFromJti(jti);
      pluginService.install(docker, name);
      return ResponseEntity.ok().build();
    } catch (Exception ex) {
      Logger.getLogger(PluginController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
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
