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

@Injectable()
export class CookieService {

  constructor() { }

  /**
   * Save a cookie.
   * @param name Cookie name.
   * @param value Cookie value.
   * @param expires (Optional) Cookie expiry datetime.
   * @param path (Optional) Cookie path.
   */
  public set(name: string, value: string, expires?: Date, path?: string) {
    let cookie = `${name}=${value}`
    if (expires != null && expires != undefined) {
      cookie += `;expires=${expires.toUTCString()}`
    }
    if (path != null && path != undefined) {
      cookie += `;path=${path}`
    }
    document.cookie = cookie
  }

  /**
   * Get a cookie.
   * @param name Cookie name.
   * @returns a cookie as a string.
   */
  public get(name: string): string {
    let cookies = this.getAll()
    let cookieVal = null
    for (let cookie of cookies) {
      let currentCookie = cookie.split('=')
      if (currentCookie[0].trim() == name) {
        cookieVal = currentCookie[1]
        break
      }
    }
    return cookieVal
  }

  /**
   * Get all the cookies.
   * @returns a string array of all cookie "name=value" pairs
   */
  public getAll(): string[] {
    return document.cookie.split(';')
  }

  /**
   * Delete a cookie.
   * @param name Cookie name.
   */
  public delete(name: string) {
    let date = new Date(0)
    let cookie = `${name}=;expires=${date.toUTCString()}`
    document.cookie = cookie
  }

  /**
   * Delete all the cookies.
   */
  public deleteAll() {
    let cookies = this.getAll()
    for (let cookie of cookies) {
      let cookieName = cookie.split('=')[0]
      this.delete(cookieName)
    }
  }

}
