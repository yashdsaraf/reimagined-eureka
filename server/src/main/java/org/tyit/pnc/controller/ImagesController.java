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

import java.io.IOException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.tyit.pnc.service.ImageService;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@RestController
@RequestMapping("/images")
public class ImagesController {

  @Autowired
  private ImageService imageService;

  @GetMapping(value = "/jpg/{name}", produces = MediaType.IMAGE_JPEG_VALUE)
  public ResponseEntity<byte[]> getJpg(@PathVariable("name") String imgName) {
    try {
      return ResponseEntity.ok(imageService.loadJpg(imgName));
    } catch (IOException ex) {
      return ResponseEntity.notFound().build();
    }
  }

  @GetMapping(value = "/svg/{name}", produces = MediaType.TEXT_HTML_VALUE)
  public ResponseEntity<String> getSvg(@PathVariable("name") String imgName) {
    try {
      return ResponseEntity.ok(imageService.loadSvg(imgName));
    } catch (IOException ex) {
      return ResponseEntity.notFound().build();
    }
  }

  @PostMapping("/jpg/{name}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<String> setJpg(@PathVariable("name") String imgName, @RequestParam("file") MultipartFile image) {
    try {
      imageService.storeJpg(imgName, image);
      return ResponseEntity.ok().build();
    } catch (IOException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

  @PostMapping("/svg/{name}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<String> setSvg(@PathVariable("name") String imgName, @RequestBody String content) {
    try {
      imageService.storeSvg(imgName, content);
      return ResponseEntity.ok().build();
    } catch (IOException ex) {
      return ResponseEntity.badRequest().build();
    }
  }

}
