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
  TestBed,
  inject
} from '@angular/core/testing'
import {HttpModule} from '@angular/http'
import {Router} from '@angular/router'

import {AuthService} from './auth.service'
import {LoginService} from './login.service'
import {MockRouter} from '../utils/mock-router'
import {CookieService} from './cookie.service'


describe('LoginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpModule],
      providers: [
        AuthService,
        CookieService,
        LoginService,
        {provide: Router, useClass: MockRouter}
      ]
    })
  })

  it('should be created', inject([LoginService, Router], (service: LoginService) => {
    expect(service).toBeTruthy()
  }))
})
