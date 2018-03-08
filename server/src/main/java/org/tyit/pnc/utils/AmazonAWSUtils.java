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

import com.amazonaws.AmazonClientException;
import com.amazonaws.AmazonServiceException;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.transfer.TransferManager;
import com.amazonaws.services.s3.transfer.TransferManagerBuilder;
import com.amazonaws.services.s3.transfer.Upload;

import java.io.File;
import java.io.IOException;
import java.util.UUID;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * @author Yash D. Saraf, Raees R. Mulla and Sachin S. Negi
 */
public final class AmazonAWSUtils {

  private final AmazonS3 amazonS3Client;

  public AmazonAWSUtils(String accessKey, String secretKey) {
    BasicAWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
    amazonS3Client = AmazonS3ClientBuilder.standard()
            .withRegion("ap-south-1")
            .withCredentials(new AWSStaticCredentialsProvider(credentials))
            .build();
  }

  public String uploadFile(File file, String bucket, String name) throws IOException {
    String randomString = UUID.randomUUID().toString().replaceAll("-", "");
    String key = randomString + name;
    TransferManager transferManager = TransferManagerBuilder.standard()
            .withS3Client(amazonS3Client)
            .build();
    Upload upload = transferManager.upload(
            new PutObjectRequest(bucket, key, file)
                    .withCannedAcl(CannedAccessControlList.PublicRead));
    try {
      upload.waitForCompletion();
      return amazonS3Client.getUrl(bucket, key).toString();
    } catch (AmazonServiceException ase) {
      System.out.println("Error Message:    " + ase.getMessage());
      System.out.println("HTTP Status Code: " + ase.getStatusCode());
      System.out.println("AWS Error Code:   " + ase.getErrorCode());
      System.out.println("Error Type:       " + ase.getErrorType());
      System.out.println("Request ID:       " + ase.getRequestId());
    } catch (AmazonClientException ace) {
      System.out.println("Error Message: " + ace.getMessage());
    } catch (InterruptedException ex) {
      Logger.getLogger(AmazonAWSUtils.class.getName()).log(Level.SEVERE, null, ex);
    }
    return null;
  }

}
