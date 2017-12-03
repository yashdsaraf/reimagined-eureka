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
  HttpInterceptor,
  HttpHandler,
  HttpHeaders,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http'
import {Observable} from 'rxjs/Observable'

import {AuthService} from '../services/auth.service'

/**
 * Adds an OAuth Bearer header on all requests made using HttpClient
 * module as long as the access token retrieved is not null.
 * If an access token is expired and a refresh token is present,
 * new access and refresh tokens are retrieved and updated locally.
 */
@Injectable()
export class OAuthInterceptor implements HttpInterceptor {

  access_token: string
  refresh_token: string

  constructor(private auth: AuthService) {
    let tokens = auth.getSavedTokens()
    this.access_token = tokens.access_token
    this.refresh_token = tokens.refresh_token
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const duplicate = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.access_token}`)
    })

    if (this.access_token == null || this.auth.isTokenExpired(this.access_token)) {
      if (this.refresh_token == null || this.auth.isTokenExpired(this.refresh_token)) {
        // TODO: Logout
      }
      let value: any = null
      // TODO: Check if "remember me" is checked and call this function
      // accordingly
      this.auth.getTokensUsingRefreshToken()
        .subscribe(
          data => {
            value = duplicate
          },
          err => {
            // TODO: Logout
          }
        )
      return next.handle(value)
    }
    return next.handle(duplicate)
  }

  success(req: HttpRequest<any>, next: HttpHandler) {


  }

}
