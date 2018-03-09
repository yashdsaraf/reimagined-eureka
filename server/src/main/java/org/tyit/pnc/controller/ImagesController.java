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
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.tyit.pnc.service.ImageService;

import java.io.IOException;
import java.net.URLDecoder;
import java.util.Map;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/images")
public class ImagesController {

  private final ImageService imageService;

  @Autowired
  public ImagesController(ImageService imageService) {
    this.imageService = imageService;
  }

  @GetMapping(value = "/jpg/{name}", produces = MediaType.IMAGE_JPEG_VALUE)
  public ResponseEntity<byte[]> getJpg(@PathVariable("name") String imgName) {
    try {
      return ResponseEntity.ok(imageService.load(imgName, true));
    } catch (IOException ex) {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping(value = "/svg/{name}", produces = MediaType.TEXT_HTML_VALUE)
  public ResponseEntity<String> getSvg(@PathVariable("name") String imgName) {
    try {
      return ResponseEntity.ok(new String(imageService.load(imgName, false)));
    } catch (IOException ex) {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping(value = "/plugins", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
  public ResponseEntity<Map<String, String>> getAllPlugins() {
    try {
      return ResponseEntity.ok(imageService.loadPlugins());
    } catch (IOException ex) {
      Logger.getLogger(ImagesController.class.getName()).log(Level.SEVERE, null, ex);
      return ResponseEntity.badRequest().build();
    }
  }

  @PostMapping("/jpg/{name}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<String> setJpg(@PathVariable("name") String imgName, @RequestParam("file") MultipartFile image) {
    try {
      imageService.store(imgName, image);
      return ResponseEntity.ok().build();
    } catch (IOException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PostMapping("/svg/{name}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<String> setSvg(@PathVariable("name") String imgName, @RequestBody String content) {
    try {
      String decoded = URLDecoder.decode(content, "UTF-8");
      imageService.store(imgName, decoded);
      return ResponseEntity.ok().build();
    } catch (IOException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PreAuthorize("hasAuthority('ADMIN')")
  @PostMapping("/plugin/{name}")
  public ResponseEntity<String> storePlugin(@PathVariable("name") String name,
                                            @RequestParam("replace") String replace,
                                            @RequestParam("content") String content) {
    try {
      String decoded = URLDecoder.decode(content, "UTF-8");
      imageService.storePlugin(name, decoded, replace);
      return ResponseEntity.ok().build();
    } catch (IOException ex) {
      Logger.getLogger(ImagesController.class.getName()).log(Level.SEVERE, null, ex);
      return ResponseEntity.badRequest().build();
    }
  }

  @PreAuthorize("hasAuthority('ADMIN')")
  @DeleteMapping("/plugin/{name}")
  public ResponseEntity<String> deletePlugin(@PathVariable("name") String name) {
    try {
      imageService.deletePlugin(name);
      return ResponseEntity.ok().build();
    } catch (IOException ex) {
      Logger.getLogger(ImagesController.class.getName()).log(Level.SEVERE, null, ex);
      return ResponseEntity.badRequest().build();
    }
  }

}
