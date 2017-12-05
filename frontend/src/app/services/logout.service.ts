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

import {Http} from '@angular/http'
import {Injectable} from '@angular/core'
import {Router} from '@angular/router'

import {AuthService} from '../services/auth.service'

@Injectable()
export class LogoutService {

  constructor(
    private authService: AuthService,
    private http: Http,
    private router: Router
  ) {}

  logout(message?: string, error?: string) {
    this.http.get('/api/destroy').subscribe(
      data => {
        let params = {message, error}
        if (data.hasOwnProperty('message')) {
          params.message = data['message']
        }
        if (data.hasOwnProperty('error')) {
          params.error = data['error']
        }
        this.authService.deleteTokens()
        this.router.navigate(['/logout', params])
      },
      err => {
        throw err
      }
    )
  }

}
