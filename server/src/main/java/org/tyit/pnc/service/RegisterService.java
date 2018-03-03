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
package org.tyit.pnc.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionSystemException;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.repository.AppUserRepository;

import javax.validation.ConstraintViolationException;
import java.time.Instant;
import java.util.Date;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class RegisterService {

  @Autowired
  private AppUserRepository appUserRepository;

  public ResponseEntity<String> register(AppUser user) {
    AppUser checkUser;
    checkUser = appUserRepository.findByUsername(user.getUsername());
    if (checkUser != null) {
      return new ResponseEntity("Username already exists", HttpStatus.BAD_REQUEST);
    }
    checkUser = appUserRepository.findByEmail(user.getEmail());
    if (checkUser != null) {
      return new ResponseEntity("Email already exists", HttpStatus.BAD_REQUEST);
    }
    user.setCreatedOn(Date.from(Instant.now()));
    user.setRole(AppUser.Role.USER);
    try {
      appUserRepository.save(user);
      return ResponseEntity.ok().build();
    } catch (TransactionSystemException ex) {
      if (ex.getRootCause() instanceof ConstraintViolationException) {
        StringBuilder sb = new StringBuilder();
        ConstraintViolationException realEx = (ConstraintViolationException) ex.getRootCause();
        realEx.getConstraintViolations().forEach((t) -> {
          sb.append(sb.length() > 0 ? ", " : "Invalid ");
          sb.append(t.getPropertyPath().toString());
        });
        return new ResponseEntity(sb.toString(), HttpStatus.BAD_REQUEST);
      }
      Logger.getLogger(RegisterService.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

}
