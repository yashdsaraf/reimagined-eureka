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
  async,
  ComponentFixture,
  TestBed
} from '@angular/core/testing'
import {FormsModule} from '@angular/forms'
import {HttpModule} from '@angular/http'
import {Router} from '@angular/router'

import {FlashMessagesModule} from 'angular2-flash-messages'

import {AuthService} from '../../services/auth.service'
import {CookieService} from '../../services/cookie.service'
import {RegisterComponent} from './register.component'
import {LoginService} from '../../services/login.service'
import {MockRouter} from '../../utils/router.mock'

describe('RegisterComponent', () => {
  let component: RegisterComponent
  let fixture: ComponentFixture<RegisterComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        FlashMessagesModule,
        FormsModule,
        HttpModule,
      ],
      providers: [
        AuthService,
        CookieService,
        LoginService,
        {provide: Router, useClass: MockRouter}
      ]
    })
      .compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
