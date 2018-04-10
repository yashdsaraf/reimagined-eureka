/*
 * Copyright 2018 Pivotal Software, Inc..
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

import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.repository.AppUserRepository;

import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.text.SimpleDateFormat;
import java.time.Instant;

/**
 * @author Raees R. Mulla
 */
@Service
public class ProfileService {

  private final AppUserRepository appUserRepository;

  private final EmailService emailService;

  @Autowired
  public ProfileService(AppUserRepository appUserRepository, EmailService emailService) {
    this.appUserRepository = appUserRepository;
    this.emailService = emailService;
  }

  public AppUser getUserDetails(String username) {
    return appUserRepository.findByUsername(username);
  }

  public void setUserDetails(AppUser user, String userName, String password) throws Exception {
    AppUser checkUser = getUser(userName);
    AppUser dbUser = appUserRepository.findByUsername(user.getUsername());
    if (dbUser != null && checkUser != dbUser) {
      throw new Exception("Username already exists");
    }
    dbUser = appUserRepository.findByEmail(user.getEmail());
    if (dbUser != null && checkUser != dbUser) {
      throw new Exception("Email already exists");
    }
    String hash = DigestUtils.sha256Hex(password.getBytes(StandardCharsets.UTF_8));
    if (!checkUser.getPassword().equals(hash)) {
      throw new Exception("Wrong password");
    }
    checkUser.setEmail(user.getEmail());
    checkUser.setName(user.getName());
    checkUser.setUsername(user.getUsername());
    appUserRepository.save(checkUser);
    String message = "Your profile was updated successfully on " +
            new SimpleDateFormat("MMM dd, yyyy 'at' HH:mm a").format(Date.from(Instant.now())) + "\n" +
            "Cheers!";
    emailService.sendEmail(user.getEmail(), "Plug n' Code: Profile updated", message);
  }

  public void setPassword(String newPassword, String oldPassword, String userName) throws Exception {
    AppUser checkUser = getUser(userName);
    String hash = DigestUtils.sha256Hex(oldPassword.getBytes(StandardCharsets.UTF_8));
    if (!checkUser.getPassword().equals(hash)) {
      throw new Exception("Wrong password");
    }
    hash = DigestUtils.sha256Hex(newPassword.getBytes(StandardCharsets.UTF_8));
    checkUser.setPassword(hash);
    appUserRepository.save(checkUser);
    String message = "Your password was updated successfully on " +
            new SimpleDateFormat("MMM dd, yyyy 'at' HH:mm a").format(Date.from(Instant.now())) + "\n" +
            "Cheers!";
    emailService.sendEmail(checkUser.getEmail(), "Plug n' Code: Password updated", message);
  }

  private AppUser getUser(String userName) throws Exception {
    AppUser checkUser = appUserRepository.findByUsername(userName);
    if (checkUser == null) {
      throw new Exception("No such user found");
    }
    return checkUser;
  }

}
