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

import org.bouncycastle.util.encoders.Hex;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.utils.SendEmail;

import javax.mail.MessagingException;
import javax.naming.NamingException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class ForgotPasswordService {

  private final AppUserRepository appUserRepository;

  @Value("${user.mail.username}")
  private String username;

  @Value("${user.mail.password}")
  private String password;

  @Value("${user.mail.server}")
  private String server;

  @Value("${user.mail.port}")
  private String port;

  @Autowired
  public ForgotPasswordService(AppUserRepository appUserRepository) {
    this.appUserRepository = appUserRepository;
  }

  public ResponseEntity<String> checkEmail(String email, HttpServletRequest req) {
    AppUser checkUser = appUserRepository.findByEmail(email);
    if (checkUser == null) {
      return new ResponseEntity<>("Email not found", HttpStatus.BAD_REQUEST);
    }
    HttpSession session = req.getSession();
    int randomPin = (int) (Math.random() * 9000) + 1000;
    String otp = String.valueOf(randomPin);
    session.setAttribute("otp", otp);
    session.setAttribute("otpExpire", LocalDateTime.now().plusMinutes(10));
    try {
      String subject = "Plug n' Code: Password recovery.";
      String body = "Hello, your One Time Password (OTP) is " + otp + ".\n"
              + "Please note that this OTP will expire after 10 minutes.\n"
              + "Cheers!";
      new SendEmail(username, password, server, port).send(email, subject, body);
    } catch (MessagingException | NamingException ex) {
      return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }
    return ResponseEntity.ok().build();
  }

  public ResponseEntity<String> checkOtp(String email, String otp, String newPassword, HttpServletRequest req) {
    HttpSession session = req.getSession();
    if (session.getAttribute("otp") == null || session.getAttribute("otpExpire") == null) {
      deleteOtp(session);
      return new ResponseEntity<>("OTP not found", HttpStatus.BAD_REQUEST);
    }
    String otpSession = (String) session.getAttribute("otp");
    LocalDateTime otpExpire = (LocalDateTime) session.getAttribute("otpExpire");
    LocalDateTime now = LocalDateTime.now();
    if (now.isEqual(otpExpire) || now.isAfter(otpExpire)) {
      deleteOtp(session);
      return new ResponseEntity<>("OTP has expired", HttpStatus.BAD_REQUEST);
    }
    if (!otp.equals(otpSession)) {
      deleteOtp(session);
      return new ResponseEntity<>("OTPs do not match", HttpStatus.BAD_REQUEST);
    }
    AppUser user = appUserRepository.findByEmail(email);
    if (user == null) {
      deleteOtp(session);
      return new ResponseEntity<>("Email does not exist", HttpStatus.BAD_REQUEST);
    }
    try {
      String passwordDigest = new String(
              Hex.encode(MessageDigest
                      .getInstance("SHA-256")
                      .digest(newPassword
                              .getBytes(StandardCharsets.UTF_8))));
      user.setPassword(passwordDigest);
      appUserRepository.save(user);
    } catch (NoSuchAlgorithmException ex) {
      Logger.getLogger(ForgotPasswordService.class.getName()).log(Level.SEVERE, null, ex);
      return new ResponseEntity<>("An internal error occured", HttpStatus.NO_CONTENT);
    }
    deleteOtp(session);
    return ResponseEntity.ok().build();
  }

  private void deleteOtp(HttpSession session) {
    session.removeAttribute("otp");
    session.removeAttribute("otpExpire");
  }

}
