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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.model.AppUser.Role;
import org.tyit.pnc.model.Developer;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.repository.DeveloperRepository;
import org.tyit.pnc.repository.PluginRepository;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class AdminService {

  @Autowired
  private AppUserRepository appUserRepository;

  @Autowired
  private PluginRepository pluginRepository;

  @Autowired
  private DeveloperRepository developerRepository;

  public Iterable<AppUser> getUsers(String name) {
    Iterable<AppUser> users;
    if (name != null && !name.isEmpty()) {
      users = appUserRepository.findAllByName(name);
    } else {
      users = appUserRepository.findAllByName("");
    }
    return users;
  }

  public Iterable<Plugin> getPlugins(String name) {
    Iterable<Plugin> plugins;
    if (name != null && !name.isEmpty()) {
      plugins = pluginRepository.findAllByName(name);
    } else {
      plugins = pluginRepository.findAll();
    }
    return plugins;
  }

  public ResponseEntity<String> deleteUser(String username) {
    AppUser user = appUserRepository.findByUsername(username);
    if (user != null) {
      if (user.getRole() == Role.ADMIN) {
        return new ResponseEntity("Cannot delete admin user", HttpStatus.BAD_REQUEST);
      }
      if (user.getRole() == Role.DEVELOPER) {
        Developer developer = developerRepository.findByUserId(user);
        developer.getPluginCollection().forEach(System.out::println);
      }
      appUserRepository.delete(user);
    }
    return ResponseEntity.ok().build();
  }

}
