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

import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Observable'

import {User} from '../models/user'

@Injectable()
export class ProfileService {

  constructor(private http: HttpClient) {}

  getUserDetails(): Observable<User> {
    return this.http.get<User>('/api/profile')
  }

  setUserDetails(user: User, password: string): Observable<any> {
    let formData = new FormData()
    formData.append('user', JSON.stringify(user))
    formData.append('password', password)
    return this.http.post('/api/profile', formData, {responseType: 'text'})
  }

  setPassword(newPassword: string, oldPassword: string): Observable<any> {
    let formData = new FormData()
    formData.append('newPassword', newPassword)
    formData.append('oldPassword', oldPassword)
    return this.http.post('/api/profile/password', formData, {responseType: 'text'})
  }

}
