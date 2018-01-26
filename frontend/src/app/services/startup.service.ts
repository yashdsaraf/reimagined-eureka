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
  Injectable,
  Injector
} from '@angular/core'
import {Router} from '@angular/router'

import {AuthService} from './auth.service'
import {DisplayNameService} from './display-name.service'

@Injectable()
export class StartupService {

  constructor(
    private authService: AuthService,
    private injector: Injector
  ) { }

  init() {
    let router: Router = this.injector.get(Router)
    let displayNameService = this.injector.get(DisplayNameService)
    let tokens = this.authService.getSavedTokens()
    if (tokens.access_token != null && tokens.access_token != undefined) {
      displayNameService.updateName(tokens.access_token)
    }
    if (!this.authService.isTokenExpired(tokens.access_token)) {
      return
    }
    if (this.authService.isTokenExpired(tokens.refresh_token)) {
      this.authService.deleteTokens()
      return
    }
    this.authService.getTokensUsingRefreshToken()
      .subscribe(
        data => this.authService.updateTokens(data.access_token, data.refresh_token),
        err => this.authService.deleteTokens()
      )
  }

}
