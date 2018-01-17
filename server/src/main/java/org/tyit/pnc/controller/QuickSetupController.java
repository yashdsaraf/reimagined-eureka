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
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.tyit.pnc.service.CoreService;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("setup")
public class QuickSetupController {

  @Autowired
  private CoreService coreService;

  @GetMapping("{language}")
  public ResponseEntity<String> quickSetup(@PathVariable("language") String lang,
          @RequestParam("project") String projectName,
          Principal principal,
          HttpServletRequest request) {
    try {
      coreService.build(lang, projectName, request.getSession(true), principal.getName());
      return ResponseEntity.ok().build();
    } catch (Exception ex) {
      Logger.getLogger(QuickSetupController.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
  }

}
