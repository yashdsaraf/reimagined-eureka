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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.tyit.pnc.service.ContactsService;

import java.io.IOException;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/contacts")
public class ContactsController {

  @Autowired
  private ContactsService contactsService;

  @GetMapping
  public ResponseEntity<Map<String, String>> getContacts() {
    try {
      return ResponseEntity.ok(contactsService.getContacts());
    } catch (IOException ex) {
      Logger.getLogger(ContactsController.class.getName()).log(Level.SEVERE, null, ex);
      return ResponseEntity.badRequest().build();
    }
  }

  @PreAuthorize("hasAuthority('ADMIN')")
  @PostMapping
  public ResponseEntity<String> setContacts(@RequestParam("phone") String phone, @RequestParam("email") String email) {
    try {
      contactsService.setContacts(phone, email);
      return ResponseEntity.ok().build();
    } catch (IOException ex) {
      Logger.getLogger(ContactsController.class.getName()).log(Level.SEVERE, null, ex);
      return ResponseEntity.badRequest().build();
    }
  }

}
