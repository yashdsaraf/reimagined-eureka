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
package org.tyit.pnc.repository;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.tyit.pnc.model.AppUser;

public interface AppUserRepository extends CrudRepository<AppUser, Long> {

  AppUser findByUsername(String username);

  @Query("SELECT U FROM AppUser U WHERE LOWER(U.name) LIKE LOWER(CONCAT(?1, '%')) AND U.username != 'guest'")
  Iterable<AppUser> findAllByName(String name);

  AppUser findByEmail(String email);

  @Query(value = "SELECT TO_CHAR(CREATED_ON, 'Month') AS MONTH, COUNT(*) AS COUNT from APP_USER GROUP BY TO_CHAR(CREATED_ON, 'Month')", nativeQuery = true)
  Iterable<Object[]> findCountPerMonths();

}
