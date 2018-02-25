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
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.service.DeveloperService;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/developer")
@PreAuthorize("hasAuthority('DEVELOPER')")
public class DeveloperController {

  @Autowired
  private DeveloperService developerService;

  @PreAuthorize("hasAuthority('USER')")
  @PostMapping("/getaccess")
  public ResponseEntity<String> getDeveloperAccess(
          @RequestParam("publicKey") String publicKey,
          Principal principal) {
    try {
      developerService.getDeveloperAccess(publicKey, principal.getName());
      return ResponseEntity.ok().build();
    } catch (Exception ex) {
      // Logger.getLogger(DeveloperController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @GetMapping("/plugins")
  public ResponseEntity<Iterator<Plugin>> getPlugins(
          @RequestParam(name = "name", required = false) String name,
          Principal principal
  ) {
    return ResponseEntity.ok(developerService.getPlugins(name, principal.getName()));
  }

  @PostMapping("/plugin/create")
  public ResponseEntity<String> createPlugin(@RequestBody Plugin plugin, Principal principal) {
    try {
      developerService.storePlugin(plugin, principal.getName(), false);
      return ResponseEntity.ok().build();
    } catch (Exception ex) {
//      Logger.getLogger(DeveloperController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @PostMapping("/plugin/update")
  public ResponseEntity<String> updatePlugin(@RequestBody Plugin plugin, Principal principal) {
    try {
      developerService.storePlugin(plugin, principal.getName(), true);
      return ResponseEntity.ok().build();
    } catch (Exception ex) {
//      Logger.getLogger(DeveloperController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

  @DeleteMapping("/plugin")
  public ResponseEntity<String> deletePlugin(@RequestParam("name") String pluginName) {
    try {
      developerService.deletePlugin(pluginName);
      return ResponseEntity.ok().build();
    } catch (Exception ex) {
//      Logger.getLogger(DeveloperController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

}
