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

import {
  Http,
  Headers
} from '@angular/http'
import {
  Injectable,
  Injector
} from '@angular/core'
import {Observable} from 'rxjs/Observable'
import 'rxjs/add/operator/map'

import {JwtHelper} from 'angular2-jwt'

import {CookieService} from './cookie.service'
import {DisplayNameService} from './display-name.service'
import {environment} from '../../environments/environment'

@Injectable()
export class AuthService {

  private jwtHelper = new JwtHelper()

  constructor(
    private cookie: CookieService,
    private http: Http,
    private injector: Injector
  ) {}

  /**
   * Retrieve access and refresh tokens from server
   * using user credentials.
   * @param username Username entered by user.
   * @param password Password entered by user.
   */
  public getTokens(username: string, password: string) {
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': `Basic ${btoa(environment.clientId + ':')}`
    })
    let content = `username=${encodeURIComponent(username)}`
      + `&password=${encodeURIComponent(password)}&grant_type=password`
    return this.http.post('/api/oauth/token', content, {headers})
      .map(data => data.json())
  }

  /**
   * Retrieve access and refresh tokens from server
   * using the refresh token.
   */
  public getTokensUsingRefreshToken() {
    let refresh_token = this.getSavedTokens().refresh_token
    let headers = new Headers({
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
      'Authorization': `Basic ${btoa(environment.clientId + ':')}`
    })
    let content = `refresh_token=${refresh_token}&grant_type=refresh_token`
    return this.http.post('/api/oauth/token', content, {headers})
      .map(data => data.json())
  }

  public updateTokens(access_token: string, refresh_token?: string) {
    this.deleteTokens()
    let displayNameService = this.injector.get(DisplayNameService)
    if (access_token !== null && access_token !== undefined) {
      this.saveToken('access_token', access_token)
      displayNameService.updateName(access_token)
    }
    if (refresh_token !== null && refresh_token !== undefined) {
      this.saveToken('refresh_token', refresh_token)
    }
  }

  /**
   * Save token in a cookie with the same expiration date as that of the token.
   * @param key Cookie key.
   * @param token Access or refresh token.
   */
  private saveToken(key: string, token: string) {
    let decodedToken = this.jwtHelper.decodeToken(token)
    let date = new Date(0)
    date.setUTCSeconds(decodedToken.exp)
    this.cookie.set(key, token, date)
  }

  /**
   * Get saved tokens from cookies.
   * @returns {access_token, refresh_token} an object of access and refresh tokens.
   */
  public getSavedTokens(): {access_token, refresh_token} {
    let access_token = this.cookie.get('access_token')
    let refresh_token = this.cookie.get('refresh_token')
    return {access_token, refresh_token}
  }

  public isTokenExpired(token: string): boolean {
    return token == null || this.jwtHelper.isTokenExpired(token)
  }

  public deleteTokens() {
    for (let token of ['access', 'refresh']) {
      this.cookie.delete(token + '_token')
    }
    let displayNameService = this.injector.get(DisplayNameService)
    displayNameService.deleteName()
  }

  /**
   * Get logged in user details by decoding the saved access_token.
   */
  private getUserDetails() {
    let access_token = this.getSavedTokens().access_token
    if (access_token == null || access_token == undefined) {
      return null
    }
    return this.jwtHelper.decodeToken(access_token)
  }

  public getRole(): string {
    if (this.getUserDetails() == null) {
      return null
    }
    return this.getUserDetails().authorities[0]
  }

  public getUsername(): string {
    if (this.getUserDetails() == null) {
      return null
    }
    return this.getUserDetails().user_name
  }

}
