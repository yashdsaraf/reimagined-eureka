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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.model.Developer;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.repository.DeveloperRepository;
import org.tyit.pnc.utils.RSAUtils;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class DeveloperService {

  @Autowired
  private DeveloperRepository developerRepository;

  @Autowired
  private AppUserRepository appUserRepository;

  public void getDeveloperAccess(String publicKey, String username) throws Exception {
    RSAUtils utils = RSAUtils.getInstance();
    utils.verify(publicKey);
    AppUser appUser = appUserRepository.findByUsername(username);
    Developer developer = new Developer();
    appUser.setRole(AppUser.Role.DEVELOPER);
    developer.setPublicKey(publicKey);
    developer.setUserId(appUser);
    appUserRepository.save(appUser);
    developerRepository.save(developer);
  }

}
