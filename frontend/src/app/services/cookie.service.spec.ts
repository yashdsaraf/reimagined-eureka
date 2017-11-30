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

 import {TestBed, inject} from '@angular/core/testing'

import {CookieService} from './cookie.service'

describe('CookieService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService]
    })
  })

  it('should be created', inject([CookieService], (service: CookieService) => {
    expect(service).toBeTruthy()
  }))

  it('should set the cookie', inject([CookieService], (service: CookieService) => {
    service.set('test1', 'value')
    service.set('test2', 'value')
    service.set('test3', 'value')
    let cookies = document.cookie
    let expected = 'test1=value; test2=value; test3=value'
    expect(cookies).toBe(expected)
  }))

  it('should get the cookie value', inject([CookieService], (service: CookieService) => {
    service.set('test1', 'value')
    let cookieValue = service.get('test1')
    let expected = 'value'
    expect(cookieValue).toBe(expected)
  }))

  it('should get all the cookies', inject([CookieService], (service: CookieService) => {
    service.set('test1', 'value')
    service.set('test2', 'value')
    service.set('test3', 'value')
    let cookies = service.getAll().join(';')
    let expected = 'test1=value; test2=value; test3=value'
    expect(cookies).toBe(expected)
  }))

  it('should delete a cookie', inject([CookieService], (service: CookieService) => {
    service.set('test1', 'value')
    service.delete('test1')
    let cookies = service.get('test1')
    let expected = null
    expect(cookies).toBe(expected)
  }))

  it('should delete all the cookies', inject([CookieService], (service: CookieService) => {
    service.set('test1', 'value')
    service.set('test2', 'value')
    service.set('test3', 'value')
    service.deleteAll()
    let cookies = document.cookie
    let expected = ''
    expect(cookies).toBe(expected)
  }))
})
