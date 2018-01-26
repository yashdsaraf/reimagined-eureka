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

// import {
//   Headers,
//   Http
// } from '@angular/http'
import {
  Injectable,
  Injector
} from '@angular/core'
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http'
import {Router} from '@angular/router'

import {AuthService} from '../services/auth.service'
import {DisplayNameService} from './display-name.service'

@Injectable()
export class LogoutService {

  constructor(
    private authService: AuthService,
    private injector: Injector,
    private router: Router
  ) {}

  logout(message?: string, error?: string) {
    let http = this.injector.get(HttpClient)
    let displayNameService = this.injector.get(DisplayNameService)
    let params = {message, error}
    http.get('/api/destroy', {responseType: 'text'}).subscribe(
      data => {
        if (data.hasOwnProperty('message')) {
          params.message = data['message']
        }
        if (data.hasOwnProperty('error')) {
          params.error = data['error']
        }
      }
    )
    this.authService.deleteTokens()
    displayNameService.deleteName()
    this.router.navigate(['/logout', params])
  }

}
