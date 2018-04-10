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
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.model.Developer;
import org.tyit.pnc.model.Plugin;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.repository.DeveloperRepository;
import org.tyit.pnc.repository.PluginRepository;
import org.tyit.pnc.utils.RSAUtils;

import javax.servlet.http.HttpSession;
import java.time.Instant;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.Iterator;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class DeveloperService {

  private final DeveloperRepository developerRepository;

  private final AppUserRepository appUserRepository;

  private final PluginRepository pluginRepository;

  @Autowired
  public DeveloperService(DeveloperRepository developerRepository, AppUserRepository appUserRepository, PluginRepository pluginRepository) {
    this.developerRepository = developerRepository;
    this.appUserRepository = appUserRepository;
    this.pluginRepository = pluginRepository;
  }

  public void getDeveloperAccess(String publicKey, String username) throws Exception {
    RSAUtils utils = RSAUtils.getInstance();
    utils.verify(publicKey);
    AppUser appUser = appUserRepository.findByUsername(username);
    Developer developer = new Developer();
    appUser.setRole(AppUser.Role.DEVELOPER);
    publicKey = publicKey.replaceAll("(-+BEGIN PUBLIC KEY-+\\r?\\n|-+END PUBLIC KEY-+\\r?\\n?)", "");
    publicKey = publicKey.replaceAll("\\n", "");
    publicKey = publicKey.replaceAll("\\r", "");
    developer.setPublicKey(publicKey);
    developer.setUserId(appUser);
    appUserRepository.save(appUser);
    developerRepository.save(developer);
  }

  public Iterator<Plugin> getPlugins(String name, String userName) {
    AppUser appUser = appUserRepository.findByUsername(userName);
    Developer developer = developerRepository.findByUserId(appUser);
    if (name != null && !name.isEmpty()) {
      return developer.getPluginCollection().stream().filter(plugin -> plugin.getName().startsWith(name)).iterator();
    }
    return developer.getPluginCollection().iterator();
  }

  public void storePlugin(Plugin plugin, String userName, boolean isUpdate) throws Exception {
    if (plugin == null) {
      throw new Exception("Invalid plugin");
    }
    AppUser appUser = appUserRepository.findByUsername(userName);
    Developer developer = developerRepository.findByUserId(appUser);
    Date now = Date.from(Instant.now());
    plugin.setStatus(Plugin.Status.PEN);
    plugin.setDeveloperId(developer);
    if (isUpdate) {
      Plugin testPlugin = pluginRepository.findByName(plugin.getName());
      if (testPlugin == null) {
        throw new Exception("No such plugin found");
      }
      plugin.setId(testPlugin.getId());
      plugin.setUpdatedOn(now);
    } else {
      Plugin testPlugin = pluginRepository.findByName(plugin.getName());
      if (testPlugin != null) {
        throw new Exception("A plugin with same name already exists");
      }
      plugin.setCreatedOn(now);
      plugin.setUpdatedOn(now);
    }
    pluginRepository.save(plugin);
  }

  public void deletePlugin(String pluginName) throws Exception {
    Plugin plugin = pluginRepository.findByName(pluginName);
    if (plugin == null) {
      throw new Exception("No such plugin found");
    }
    pluginRepository.delete(plugin);
  }

  public byte[] getEncryptedOtp(HttpSession session, String userName) throws Exception {
    AppUser appUser = appUserRepository.findByUsername(userName);
    Developer developer = developerRepository.findByUserId(appUser);
    int randomPin = (int) (Math.random() * 9000) + 1000;
    String otp = String.valueOf(randomPin);
    session.setAttribute("devOtp", otp);
    session.setAttribute("devOtpExpire", LocalDateTime.now().plusMinutes(10));
    return RSAUtils.getInstance().encrypt(otp, developer.getPublicKey());
  }

  public void checkOtp(HttpSession session, String otp) throws Exception {
    String sessionOtp = (String) session.getAttribute("devOtp");
    LocalDateTime sessionOtpExpire = (LocalDateTime) session.getAttribute("devOtpExpire");
    LocalDateTime now = LocalDateTime.now();
    if (now.isEqual(sessionOtpExpire) || now.isAfter(sessionOtpExpire)) {
      deleteOtp(session);
      throw new Exception("OTP has expired");
    }
    if (!otp.equals(sessionOtp)) {
      deleteOtp(session);
      throw new Exception("OTPs do not match");
    }
  }

  private void deleteOtp(HttpSession session) {
    session.removeAttribute("devOtp");
    session.removeAttribute("devOtpExpire");
  }

}
