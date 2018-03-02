/*
 * Copyright 2017 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
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
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.tyit.pnc.service.DockerService;
import org.tyit.pnc.utils.JwtUtils;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/destroy")
public class LogoutController {

  @Autowired
  private DockerService dockerService;

  @GetMapping
  public ResponseEntity<String> destroy(HttpServletRequest request) {
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

}
