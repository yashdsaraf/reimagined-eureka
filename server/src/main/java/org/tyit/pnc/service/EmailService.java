/*
 * Copyright 2018 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *      http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

package org.tyit.pnc.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.tyit.pnc.utils.SendEmail;

import javax.mail.MessagingException;
import javax.naming.NamingException;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class EmailService {

  @Value("${user.mail.username}")
  private String username;

  @Value("${user.mail.password}")
  private String password;

  @Value("${user.mail.server}")
  private String server;

  @Value("${user.mail.port}")
  private String port;

  public void sendEmail(String recipient, String subject, String message) throws MessagingException, NamingException {
    new SendEmail(username, password, server, port).send(recipient, subject, message);
  }

}
