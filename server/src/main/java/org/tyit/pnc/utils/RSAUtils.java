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

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.KeyFactory;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.X509EncodedKeySpec;
import java.util.Base64;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
public final class RSAUtils {

  private static final RSAUtils utils = new RSAUtils();

  private RSAUtils() {

  }

  public static final RSAUtils getInstance() {
    return utils;
  }

  public void verify(String publicKey) throws Exception {
    if (publicKey == null || publicKey.isEmpty()) {
      throw new Exception("Public key cannot be empty");
    }
    Pattern pattern = Pattern.compile("^-+BEGIN PUBLIC KEY-+\\r?\\n|-+END PUBLIC KEY-+\\r?\\n?$");
    Matcher matcher = pattern.matcher(publicKey);
    if (!matcher.lookingAt()) {
      throw new Exception("Invalid key format");
    }
  }

  public byte[] encrypt(String content, String publicKeyStr) throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException, InvalidKeySpecException, IOException, IllegalBlockSizeException, BadPaddingException {
    Cipher encryptCipher = Cipher.getInstance("RSA");
    encryptCipher.init(Cipher.ENCRYPT_MODE, getPublicKeyFromString(publicKeyStr));
    byte[] text = encryptCipher.doFinal(content.getBytes(StandardCharsets.UTF_8));
    return text;
  }

  private PublicKey getPublicKeyFromString(String publicKey) throws IOException, NoSuchAlgorithmException, InvalidKeySpecException {
    byte[] keyBytes = Base64.getDecoder().decode(publicKey.getBytes());
    X509EncodedKeySpec spec = new X509EncodedKeySpec(keyBytes);
    KeyFactory factory = KeyFactory.getInstance("RSA");
    return factory.generatePublic(spec);
  }

}
