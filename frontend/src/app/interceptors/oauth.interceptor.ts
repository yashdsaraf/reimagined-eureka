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
import {LogoutService} from '../services/logout.service'

/**
 * Adds an OAuth Bearer header on all requests made using HttpClient
 * module as long as the access token retrieved is not null.
 * If an access token is expired and a refresh token is present,
 * new access and refresh tokens are retrieved and updated locally.
 */
@Injectable()
export class OAuthInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private logoutService: LogoutService
  ) {}

  get tokens() {
    return this.authService.getSavedTokens()
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.tokens.access_token == null) {
      return next.handle(req)
    }

    if (this.authService.isTokenExpired(this.tokens.access_token)) {
      if (this.authService.isTokenExpired(this.tokens.refresh_token)) {
        this.error("Session expired")
      } else {
        this.authService.getTokensUsingRefreshToken()
          .subscribe(data => {
            this.authService.updateTokens(data.access_token)
            this.authService.updateTokens(data.refresh_token)
          }, err => {
            this.authService.deleteTokens()
            this.error(err)
          })
      }
    }

    let duplicate = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${this.tokens.access_token}`)
    })

    return next.handle(duplicate)
  }

  error(cause: string) {
    this.logoutService.logout(null, cause)
  }

}
