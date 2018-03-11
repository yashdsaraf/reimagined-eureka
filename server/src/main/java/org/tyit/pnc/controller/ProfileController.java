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

  import com.fasterxml.jackson.databind.ObjectMapper;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.http.ResponseEntity;
  import org.springframework.security.access.prepost.PreAuthorize;
  import org.springframework.web.bind.annotation.*;
  import org.tyit.pnc.model.AppUser;
  import org.tyit.pnc.service.ProfileService;

  import java.security.Principal;
  import java.util.Map;

  /**
   * @author Raees R. Mulla
   */
  @RestController
  @RequestMapping("/profile")
  @PreAuthorize("hasAnyAuthority('USER', 'DEVELOPER', 'ADMIN')")
  public class ProfileController {

    private final ProfileService profileService;

    @Autowired
    public ProfileController(ProfileService profileService) {
      this.profileService = profileService;
    }

    @GetMapping
    public ResponseEntity<AppUser> getUserDetails(Principal principal) {
      return ResponseEntity.ok(profileService.getUserDetails(principal.getName()));
    }

    @PostMapping
    public ResponseEntity<String> setUserDetails(
            @RequestParam Map<String, String> map,
            Principal principal
    ) {
      try {
        String password = map.get("password");
        AppUser user = new ObjectMapper().readValue(map.get("user"), AppUser.class);
        profileService.setUserDetails(user, principal.getName(), password);
        return ResponseEntity.ok().build();
      } catch (Exception ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
      }
    }

    @PostMapping("/password")
    public ResponseEntity<String> setPassword(
            @RequestParam("oldPassword") String oldPassword,
            @RequestParam("newPassword") String newPassword,
            Principal principal
    ) {
      try {
        profileService.setPassword(newPassword, oldPassword, principal.getName());
        return ResponseEntity.ok().build();
      } catch (Exception ex) {
        return ResponseEntity.badRequest().body(ex.getMessage());
      }
    }

  }
