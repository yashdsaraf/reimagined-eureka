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

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.model.CodeSnippet;
import org.tyit.pnc.repository.AppUserRepository;
import org.tyit.pnc.repository.CodeSnippetRepository;

import java.time.Instant;
import java.util.Date;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class BlogService {

  private final AppUserRepository appUserRepository;

  private final CodeSnippetRepository codeSnippetRepository;

  @Autowired
  public BlogService(AppUserRepository appUserRepository, CodeSnippetRepository codeSnippetRepository) {
    this.appUserRepository = appUserRepository;
    this.codeSnippetRepository = codeSnippetRepository;
  }

  public void checkTitle(String title) throws Exception {
    CodeSnippet snippet = codeSnippetRepository.findByTitle(title);
    if (snippet != null) {
      throw new Exception("Snippet with such title already exists");
    }
  }

  public CodeSnippet getSnippet(String title) {
    return codeSnippetRepository.findByTitle(title);
  }

  public Iterable<CodeSnippet> getSnippets(String title) {
    Iterable<CodeSnippet> plugins;
    if (title != null && !title.isEmpty()) {
      plugins = codeSnippetRepository.findAllByTitle(title);
    } else {
      plugins = codeSnippetRepository.findAll();
    }
    return plugins;
  }

  public void createSnippet(CodeSnippet snippet, String userName) {
    AppUser user = appUserRepository.findByUsername(userName);
    snippet.setCreatedOn(Date.from(Instant.now()));
    snippet.setUpdatedOn(Date.from(Instant.now()));
    snippet.setUserId(user);
    codeSnippetRepository.save(snippet);
  }

  public void updateSnippet(CodeSnippet snippet, String userName) throws Exception {
    AppUser user = appUserRepository.findByUsername(userName);
    CodeSnippet checkSnippet = codeSnippetRepository.findByTitleAndUserId(snippet.getTitle(), user);
    if (checkSnippet == null) {
      throw new Exception("No such snippet found in database");
    }
    checkSnippet.setUpdatedOn(Date.from(Instant.now()));
    checkSnippet.setCode(snippet.getCode());
    codeSnippetRepository.save(checkSnippet);
  }

  public void deleteSnippet(String title, String userName) throws Exception {
    AppUser user = appUserRepository.findByUsername(userName);
    CodeSnippet checkSnippet = codeSnippetRepository.findByTitleAndUserId(title, user);
    if (checkSnippet == null) {
      throw new Exception("No such snippet found in database");
    }
    codeSnippetRepository.delete(checkSnippet);
  }
}
