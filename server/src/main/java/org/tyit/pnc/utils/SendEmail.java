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
package org.tyit.pnc.utils;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMessage.RecipientType;
import javax.mail.internet.MimeMultipart;
import javax.naming.NamingException;
import java.util.Properties;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
public class SendEmail {

  private Session session;
  private String username, password, server, port;

  public SendEmail(String username, String password, String server, String port) {
    this.username = username;
    this.password = password;
    this.server = server;
    this.port = port;
  }

  public void send(String recipient, String subject, String message) throws MessagingException, NamingException {
    Properties props = new Properties();
    props.put("mail.smtp.host", server);
    props.put("mail.smtp.port", port);
    props.put("mail.smtp.starttls.enable", "true");
    props.put("mail.smtp.auth", "true");

    session = Session.getInstance(props, new Authenticator() {
      @Override
      protected PasswordAuthentication getPasswordAuthentication() {
        return new PasswordAuthentication(username, password);
      }
    });

    Message msg = new MimeMessage(session);
    msg.setSubject(subject);
    msg.setFrom(new InternetAddress(username));
    msg.addRecipient(RecipientType.TO, new InternetAddress(recipient));
    BodyPart msgBodyPart = new MimeBodyPart();
    msgBodyPart.setText(message);
    Multipart multiPart = new MimeMultipart();
    multiPart.addBodyPart(msgBodyPart);
    msg.setContent(multiPart);
    Transport.send(msg);
  }
}
