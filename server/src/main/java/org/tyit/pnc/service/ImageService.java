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

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class ImageService {

  public void storeJpg(String name, MultipartFile image) throws IOException {
    Resource resource = new ClassPathResource("images");
    File file = new File(resource.getFile(), name + ".jpg");
    Files.write(Paths.get(file.getAbsolutePath()), image.getBytes(), StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
  }

  public void storeSvg(String name, String content) throws IOException {
    Resource resource = new ClassPathResource("images");
    File file = new File(resource.getFile(), name + ".svg");
    Files.write(Paths.get(file.getAbsolutePath()), content.getBytes(StandardCharsets.UTF_8), StandardOpenOption.TRUNCATE_EXISTING, StandardOpenOption.CREATE);
  }

  public byte[] loadJpg(String name) throws IOException {
    Resource resource = new ClassPathResource("images" + File.separator + name + ".jpg");
    InputStream inputStream = resource.getInputStream();
    byte[] byteStream = new byte[inputStream.available()];
    inputStream.read(byteStream);
    return byteStream;
  }

  public String loadSvg(String name) throws IOException {
    Resource resource = new ClassPathResource("images" + File.separator + name + ".svg");
    StringBuilder stringBuffer = new StringBuilder();
    Files.readAllLines(Paths.get(resource.getURI())).forEach(stringBuffer::append);
    return stringBuffer.toString();
  }

}
