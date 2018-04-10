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
import org.tyit.pnc.model.AppAdmin;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.model.AppUser.Role;
import org.tyit.pnc.model.CodeSnippet;
import org.tyit.pnc.model.Developer;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.repository.AppAdminRepository;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.repository.CodeSnippetRepository;
import org.tyit.pnc.repository.DeveloperRepository;
import org.tyit.pnc.repository.PluginRepository;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class AdminService {

  private final AppUserRepository appUserRepository;

  private final PluginRepository pluginRepository;

  private final DeveloperRepository developerRepository;

  private final AppAdminRepository appAdminRepository;

  private final CodeSnippetRepository codeSnippetRepository;


  @Autowired
  public AdminService(AppUserRepository appUserRepository, PluginRepository pluginRepository, DeveloperRepository developerRepository, AppAdminRepository appAdminRepository, CodeSnippetRepository codeSnippetRepository) {
    this.appUserRepository = appUserRepository;
    this.pluginRepository = pluginRepository;
    this.developerRepository = developerRepository;
    this.appAdminRepository = appAdminRepository;
    this.codeSnippetRepository = codeSnippetRepository;
  }

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
        return new ResponseEntity<>("Cannot delete admin user", HttpStatus.BAD_REQUEST);
      }
      if (user.getRole() == Role.DEVELOPER) {
        Developer developer = developerRepository.findByUserId(user);
        pluginRepository.delete(developer.getPluginCollection());
        developerRepository.delete(developer);
      }
      appUserRepository.delete(user);
    }
    return ResponseEntity.ok().build();
  }

  public ResponseEntity<String> deletePlugin(String name) {
    Plugin plugin = pluginRepository.findByName(name);
    if (plugin != null) {
      pluginRepository.delete(plugin);
    }
    return ResponseEntity.ok().build();
  }

  public ResponseEntity<String> approvePlugin(String name, String userName) {
    Plugin plugin = pluginRepository.findByName(name);
    AppUser user = appUserRepository.findByUsername(userName);
    AppAdmin admin = appAdminRepository.findByUserId(user);
    if (plugin != null && plugin.getStatus() == Plugin.Status.PEN) {
      plugin.setStatus(Plugin.Status.APP);
      plugin.setAdminid(admin);
      pluginRepository.save(plugin);
    }
    return ResponseEntity.ok().build();
  }

  public void deleteSnippet(String title) throws Exception {
    CodeSnippet codeSnippet = codeSnippetRepository.findByTitle(title);
    if (codeSnippet == null) {
      throw new Exception("No such snippet found");
    }
    codeSnippetRepository.delete(codeSnippet);
  }

}
