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

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.Map;
import java.util.TreeMap;

/**
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class ImageService {

  private ClassPathResource getResource() {
    return new ClassPathResource("images");
  }

  private ClassPathResource getResource(String path) {
    return new ClassPathResource(path);
  }

  public void store(String name, MultipartFile image) throws IOException {
    File file = new File(getResource().getFile(), name + ".jpg");
    Files.write(Paths.get(file.getAbsolutePath()), image.getBytes(), StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
  }

  public void store(String name, String content) throws IOException {
    store(name, content, getResource());
  }

  private void store(String name, String content, ClassPathResource resource) throws IOException {
    File file = new File(resource.getFile(), name.toLowerCase() + ".svg");
    Files.write(Paths.get(file.getAbsolutePath()), content.getBytes(StandardCharsets.UTF_8), StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
  }

  public byte[] load(String name, boolean isJpg) throws IOException {
    String extension = isJpg ? ".jpg" : ".svg";
    return Files.readAllBytes(Paths.get(getResource().getFile().getAbsolutePath(), name + extension));
  }

  public void delete(String name, boolean isJpg) throws IOException {
    delete(name, isJpg, getResource());
  }

  private void delete(String name, boolean isJpg, ClassPathResource resource) throws IOException {
    String extension = isJpg ? ".jpg" : ".svg";
    File file = new File(resource.getFile(), name + extension);
    if (!file.exists()) {
      throw new IOException("Image does not exist");
    }
    if (!file.delete()) {
      throw new IOException("Exception occurred while delete the image");
    }
  }

  public Map<String, String> loadPlugins() throws IOException {
    File[] images = getResource("images/plugins").getFile().listFiles();
    Map<String, String> imageMap = new TreeMap<>();
    StringBuilder stringBuilder;
    if (images != null) {
      for (File image : images) {
        stringBuilder = new StringBuilder();
        String key = image.getName();
        key = key.substring(0, key.length() - 4);
        Files.readAllLines(image.toPath()).forEach(stringBuilder::append);
        String value = stringBuilder.toString();
        imageMap.put(key, value);
      }
    }
    return imageMap;
  }

  public void deletePlugin(String name) throws IOException {
    delete(name, false, getResource("images/plugins"));
  }

  public void storePlugin(String name, String image, String replace) throws IOException {
    deletePlugin(replace);
    store(name, image, getResource("images/plugins"));
  }

}
