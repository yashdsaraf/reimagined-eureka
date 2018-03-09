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

package org.tyit.pnc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tyit.pnc.model.CodeSnippet;
import org.tyit.pnc.service.BlogService;

import java.security.Principal;
import java.util.Base64;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/blog")
public class BlogController {

  private final BlogService blogService;

  @Autowired
  public BlogController(BlogService blogService) {
    this.blogService = blogService;
  }

  @GetMapping("/check/{title}")
  public ResponseEntity checkTitle(@PathVariable("title") String title) {
    title = new String(Base64.getDecoder().decode(title));
    try {
      blogService.checkTitle(title);
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @GetMapping("{title}")
  public CodeSnippet getSnippet(@PathVariable("title") String title) {
    title = new String(Base64.getDecoder().decode(title));
    return blogService.getSnippet(title);
  }

  @GetMapping
  public Iterable<CodeSnippet> getSnippets(@RequestParam(name = "title", required = false) String title) {
    return blogService.getSnippets(title);
  }

  @PostMapping("/create")
  public ResponseEntity<String> createSnippet(@RequestBody CodeSnippet snippet, Principal principal) {
    blogService.createSnippet(snippet, principal.getName());
    return ResponseEntity.ok().build();
  }

  @PostMapping("/edit")
  public ResponseEntity<String> updateSnippet(@RequestBody CodeSnippet snippet, Principal principal) {
    try {
      blogService.updateSnippet(snippet, principal.getName());
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

  @DeleteMapping
  public ResponseEntity<String> deleteSnippet(String title, Principal principal) {
    try {
      blogService.deleteSnippet(title, principal.getName());
      return ResponseEntity.ok().build();
    } catch (Exception e) {
      return ResponseEntity.badRequest().body(e.getMessage());
    }
  }

}
