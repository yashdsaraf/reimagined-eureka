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
package org.tyit.pnc.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.Base64;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
public final class JwtUtils {

  private static final JwtUtils JU = new JwtUtils();

  private JwtUtils() {
  }

  public static JwtUtils getInstance() {
    return JU;
  }

  public String getJti(String token) throws IOException {
    String encoded = token.split("\\.")[1];
    String decoded = new String(Base64.getDecoder().decode(encoded));
    ObjectMapper mapper = new ObjectMapper();
    JsonNode node = mapper.readTree(decoded);
    return node.get("jti").toString();
  }

}
