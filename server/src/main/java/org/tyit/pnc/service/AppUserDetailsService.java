/*
 * Copyright 2017 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
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

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.tyit.pnc.model.AppUser;
import org.tyit.pnc.repository.AppUserRepository;

/**
 *
 * @author Yash D. Saraf <yashdsaraf@gmail.com>
 */
@Service
public class AppUserDetailsService implements UserDetailsService {

  private static final String EMPTY_PASSWORD = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855";

  @Autowired
  private AppUserRepository userRepository;

  @Override
  public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    List<GrantedAuthority> authorities;
    if (username.equalsIgnoreCase("guest")) {
      authorities = Arrays.asList(
              new SimpleGrantedAuthority("GUEST"));
      return new org.springframework.security.core.userdetails.User(username, EMPTY_PASSWORD, authorities);
    }

    AppUser user = userRepository.findByUsername(username);

    if (user == null) {
      throw new UsernameNotFoundException("The login ID " + username + " does not exist");
    }

    authorities = Arrays.asList(
            new SimpleGrantedAuthority(user.getRole().toString()));
    UserDetails userDetails = new User(user.getName(), user.getPassword(), authorities);
    return userDetails;
  }

}
