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

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.bouncycastle.util.encoders.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.service.RegisterService;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
public class RegisterController {

  @Autowired
  private RegisterService registerService;

  @PostMapping(path = "/register", consumes = MediaType.APPLICATION_FORM_URLENCODED_VALUE)
  public ResponseEntity<String> register(@RequestParam Map<String, String> params) {
    AppUser user = new AppUser();
    try {
      String password = params.get("password");
      String passwordDigest = new String(
              Hex.encode(MessageDigest
                      .getInstance("SHA-256")
                      .digest(password
                              .getBytes(StandardCharsets.UTF_8))));
      user.setName(params.get("name"));
      user.setEmail(params.get("email"));
      user.setUsername(params.get("username"));
      user.setPassword(passwordDigest);
      return registerService.register(user);
    } catch (NoSuchAlgorithmException ex) {
      Logger.getLogger(RegisterController.class.getName()).log(Level.SEVERE, null, ex);
    } catch (NullPointerException ex) {
      return ResponseEntity.badRequest().build();
    }
    return ResponseEntity.ok("An internal error occured");
  }

}
