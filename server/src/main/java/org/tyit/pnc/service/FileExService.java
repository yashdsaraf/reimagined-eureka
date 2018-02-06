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

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.File;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.http.HttpSession;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.FilenameUtils;
import org.springframework.stereotype.Service;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class FileExService {

  private final JsonNodeFactory factory = JsonNodeFactory.instance;

  public String getFileTree(HttpSession session) throws IOException, Exception {
    Path tmpDir = (Path) session.getAttribute("tmpDir");
    if (tmpDir == null) {
      throw new Exception("No project found in session");
    }
    ArrayNode files = factory.arrayNode().add(traverseTreeToJson(tmpDir, true));
    return files.toString();
  }

  private ObjectNode traverseTreeToJson(Path root, boolean isRoot) throws IOException {
    ArrayNode files = factory.arrayNode();
    ObjectNode dir = factory.objectNode();
    dir.set("text", factory.textNode(FilenameUtils.getName(root.toString())));
    if (isRoot) {
      ObjectNode state = factory.objectNode();
      state.set("opened", factory.booleanNode(true));
      dir.set("state", state);
    }
    Files.walk(root, 1).forEachOrdered(i -> {
      if (root.equals(i)) {
        return;
      }
      ObjectNode file = factory.objectNode();
      file.set("text", factory.textNode(FilenameUtils.getName(i.toString())));
      if (Files.isDirectory(i)) {
        try {
          files.add(traverseTreeToJson(i, false));
        } catch (IOException ex) {
          Logger.getLogger(FileExService.class.getName()).log(Level.SEVERE, null, ex);
        }
      } else {
        file.set("type", factory.textNode("file"));
        files.add(file);
      }
    });
    dir.set("children", files);
    return dir;
  }

  private String getRealPath(HttpSession session, String parent) throws Exception {
    Path tmpDir = (Path) session.getAttribute("tmpDir");
    parent = FilenameUtils.separatorsToSystem(parent);
    String realPath = FilenameUtils.concat(tmpDir.toString(), parent);
    if (realPath == null) {
      throw new Exception("Invalid path specified");
    }
    return realPath;
  }

  public void create(HttpSession session, String fileName, String parents, boolean isDir) throws Exception {
    String realPath = getRealPath(session, parents);
    File toCreate = new File(realPath, fileName);
    if (isDir) {
      Files.createDirectory(toCreate.toPath());
    } else {
      Files.createFile(toCreate.toPath());
    }
  }

  public void delete(HttpSession session, String filename, String parent) throws Exception {
    String realPath = getRealPath(session, parent);
    File file = new File(realPath, filename);
    if (file.exists()) {
      if (file.isDirectory()) {
        FileUtils.deleteDirectory(file);
      } else {
        file.delete();
      }
    }
  }

  public void copy(HttpSession session, String filename, String oldParent, String newParent, boolean isMove) throws Exception {
    String realOldPath = getRealPath(session, oldParent);
    String realNewPath = getRealPath(session, newParent);
    File file = new File(realOldPath, filename);
    FileUtils.copyToDirectory(file, new File(realNewPath));
    if (isMove) {
      delete(session, filename, oldParent);
    }
  }

  public void rename(HttpSession session, String filename, String parent, String newname) throws Exception {
    String realPath = getRealPath(session, parent);
    File file = new File(realPath, filename);
    if (!file.exists()) {
      throw new Exception("No such file exists");
    }
    file.renameTo(new File(realPath, newname));
  }

  public String getFile(HttpSession session, String filename, String parent) throws Exception {
    String realPath = getRealPath(session, parent);
    Path path = Paths.get(FilenameUtils.concat(realPath, filename));
    return new String(Files.readAllBytes(path), StandardCharsets.UTF_8);
  }

}
