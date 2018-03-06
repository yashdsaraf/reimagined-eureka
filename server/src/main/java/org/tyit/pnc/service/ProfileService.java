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

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.repository.AppUserRepository;

/**
 *
 * @author Raees R. Mulla
 */
@Service
public class ProfileService {

    @Autowired
    private AppUserRepository appUserRepository;

    public AppUser getUserDetails(String username) {
        AppUser user = appUserRepository.findByUsername(username);
        return user;
    }

    public void setUserDetails(AppUser user, String username, String password) throws Exception {
        AppUser checkUser = appUserRepository.findByUsername(username);
        if (checkUser == null) {
            throw new Exception("No such user found");
        }
        if (appUserRepository.findByUsername(user.getUsername()) != null) {
            throw new Exception("Username already exists");
        }
        if (appUserRepository.findByEmail(user.getEmail()) != null) {
            throw new Exception("Email already exists");
        }
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        String hash = new String(digest.digest(password.getBytes(StandardCharsets.UTF_8)));
        if (!checkUser.getPassword().equals(hash)) {
            throw new Exception("Wrong password");
        }
        checkUser.setEmail(user.getEmail());
        checkUser.setName(user.getName());
        checkUser.setUsername(user.getUsername());
        checkUser.setPassword(user.getPassword());
        appUserRepository.save(checkUser);
    }

}
