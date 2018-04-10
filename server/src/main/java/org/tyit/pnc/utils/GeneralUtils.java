/*
 * Copyright 2018 Pivotal Software, Inc..
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

import org.apache.commons.io.FilenameUtils;

import java.io.File;

/**
 * @author yashd
 */
public class GeneralUtils {

  private static GeneralUtils generalUtils;

  private GeneralUtils() {

  }

  public static GeneralUtils getInstance() {
    if (generalUtils == null) {
      generalUtils = new GeneralUtils();
    }
    return generalUtils;
  }

  public String getUnixPath(String windowsPath) {
    String prefix = FilenameUtils.getPrefix(windowsPath);
    prefix = File.separator + prefix.toLowerCase().replace(':', File.separatorChar);
    String unixPath = FilenameUtils.concat(prefix, FilenameUtils.getPath(windowsPath));
    unixPath = FilenameUtils.separatorsToUnix(unixPath) + FilenameUtils.getName(windowsPath);
    return unixPath;
  }

}
