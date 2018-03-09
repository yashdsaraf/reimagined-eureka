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
package org.tyit.pnc.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.tyit.pnc.service.StatsService;

import java.util.List;
import java.util.Map;

/**
 * @author Raees R. Mulla
 */
@RestController
@RequestMapping("/stats")
@PreAuthorize("hasAuthority('ADMIN')")
public class StatsController {

  private final StatsService statsService;

  @Autowired
  public StatsController(StatsService statsService) {
    this.statsService = statsService;
  }

  @GetMapping("/count")
  public ResponseEntity<Map<String, Integer>> getTotalCount() {
    return ResponseEntity.ok(statsService.getTotalCount());
  }

  @GetMapping("/users")
  public ResponseEntity<List<List<String>>> getUserPerMonth() {
    return ResponseEntity.ok(statsService.getUserPerMonth());
  }

  @GetMapping("/plugins")
  public ResponseEntity<List<List<String>>> getPluginsPerMonth() {
    return ResponseEntity.ok(statsService.getPluginsPerMonth());
  }

  @GetMapping("/installs")
  public ResponseEntity<List<List<String>>> getPluginsPerInstalls() {
    return ResponseEntity.ok(statsService.getPluginsPerInstalls());
  }

}
