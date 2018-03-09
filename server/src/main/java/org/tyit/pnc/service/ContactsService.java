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
package org.tyit.pnc.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.StandardOpenOption;
import java.util.HashMap;
import java.util.Map;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class ContactsService {

  private File contactsFile;

  public ContactsService() throws IOException {
    contactsFile = new ClassPathResource("assets/contacts.json").getFile();
    writeContactsToFile("99-9999-9999", "help.plugncode@gmail.com", contactsFile);
  }

  public Map<String, String> getContacts() throws IOException {
    TypeReference<HashMap<String, String>> typeRef = new TypeReference<HashMap<String, String>>() {
    };
    return new ObjectMapper().readValue(contactsFile, typeRef);
  }

  private void writeContactsToFile(String phone, String email, File file) throws IOException {
    Map<String, String> map = new HashMap<>();
    map.put("phone", phone);
    map.put("email", email);
    Files.write(file.toPath(), new ObjectMapper().writeValueAsBytes(map),
            StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
  }

  public void setContacts(String phone, String email) throws IOException {
    writeContactsToFile(phone, email, contactsFile);
  }

}
