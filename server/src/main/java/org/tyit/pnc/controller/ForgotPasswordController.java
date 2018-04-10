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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.tyit.pnc.service.ForgotPasswordService;

import javax.servlet.http.HttpServletRequest;
import java.util.Map;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/forgotpassword")
public class ForgotPasswordController {

  private final ForgotPasswordService forgotPasswordService;

  @Autowired
  public ForgotPasswordController(ForgotPasswordService forgotPasswordService) {
    this.forgotPasswordService = forgotPasswordService;
  }

  @PostMapping
  public ResponseEntity<String> checkEmail(@RequestParam Map<String, String> params, HttpServletRequest request) {
    if (params.containsKey("otp")) {
      String email = params.get("email");
      String otp = params.get("otp");
      String password = params.get("password");
      return forgotPasswordService.checkOtp(email, otp, password, request);
    } else {
      try {
        String email = params.get("email");
        return forgotPasswordService.checkEmail(email, request);
      } catch (NullPointerException ex) {
        return new ResponseEntity<>("Invalid request structure", HttpStatus.BAD_REQUEST);
      }
    }
  }

}
