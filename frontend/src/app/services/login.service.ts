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
import {
  Http,
  Headers,
  Response
} from '@angular/http'
import {Router} from '@angular/router'

import {AuthService} from './auth.service'
import {HttpUtils} from '../utils/http-utils'
import {LogoutComponent} from '../components/logout/logout.component'
import {User} from '../models/user'

@Injectable()
export class LoginService {

  headers = new Headers({
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
  })

  constructor(
    private authService: AuthService,
    private http: Http,
    private router: Router
  ) {}

  public login(username: string, password: string, remember_me: boolean): Promise<any> {
    return new Promise((resolve, reject) => {
      this.authService.getTokens(username, password)
      .subscribe(
        data => {
          if (remember_me) {
            this.authService.updateTokens(data.access_token, data.refresh_token)
          } else {
            this.authService.updateTokens(data.access_token)
          }
          this.router.navigate([''])
          resolve()
        },
        err => {
          reject(err._body)
        }
      )
    })
  }

  public register(user: User, remember_me: boolean): Promise<any> {
    let params = HttpUtils.getURLParams(user)
    return new Promise((resolve, reject) => {
      this.http.post('/api/register', params, {headers: this.headers})
      .subscribe(
        data => resolve(),
        err => reject(err._body)
      )
    })
  }

  public forgotPasswordEmail(email: string): Promise<any> {
    let params = HttpUtils.getURLParams({email})
    return new Promise((resolve, reject) => {
      this.http.post('/api/forgotpassword', params, {headers: this.headers})
      .subscribe(
        data => resolve(),
        err => reject(err._body)
      )
    })
  }

  public forgotPasswordOtp(email: string, otp: string, password: string): Promise<any> {
    let params = HttpUtils.getURLParams({email, otp, password})
    return new Promise((resolve, reject) => {
      this.http.post('/api/forgotpassword', params, {headers: this.headers})
      .subscribe(
        data => resolve(),
        err => reject(err._body)
      )
    })
  }

  public loginAsGuest(): Promise<any> {
  	return new Promise((resolve, reject) => {
      this.authService.getTokens('guest', '')
      .subscribe(
        data => {
					this.authService.updateTokens(data.access_token)
          this.router.navigate([''])
          resolve()
        },
        err => {
          reject(err._body)
        }
      )
    })
  }

}
