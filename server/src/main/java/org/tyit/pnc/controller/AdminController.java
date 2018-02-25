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
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.service.AdminService;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@PreAuthorize("hasAuthority('ADMIN')")
@RequestMapping("/admin")
public class AdminController {

  @Autowired
  private AdminService adminService;

  @GetMapping("/users")
  public ResponseEntity<Iterable<AppUser>> getUsers(@RequestParam(name = "name", required = false) String name) {
    return ResponseEntity.ok(adminService.getUsers(name));
  }

  @GetMapping("/plugins")
  public ResponseEntity<Iterable<Plugin>> getPlugins(@RequestParam(name = "name", required = false) String name) {
    return ResponseEntity.ok(adminService.getPlugins(name));
  }

  @PutMapping("/plugin/{name}")
  public ResponseEntity<String> approvePlugin(@PathVariable("name") String name, Principal principal) {
    return adminService.approvePlugin(name, principal.getName());
  }

  @DeleteMapping("/user")
  public ResponseEntity<String> deleteUser(@RequestParam("username") String username) {
    return adminService.deleteUser(username);
  }

  @DeleteMapping("/plugin/{name}")
  public ResponseEntity<String> deletePlugin(@PathVariable("name") String name) {
    return adminService.deletePlugin(name);
  }

}
