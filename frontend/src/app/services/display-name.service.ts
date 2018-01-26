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
  Headers
} from '@angular/http'
import {Observable} from 'rxjs/Observable'

const KEY = 'name'

@Injectable()
export class DisplayNameService {

  constructor(private http: Http) { }

  public getName(): string {
    return localStorage.getItem(KEY)
  }

  public updateName(access_token: string) {
    let headers = new Headers({'Authorization': `Bearer ${access_token}`})
    this.http.get('/api/name', {headers})
      .subscribe(
        data => {
          this.setName(data.text())
        }
      )
  }

  private setName(name: string) {
    localStorage.setItem(KEY, name)
  }

  public deleteName() {
    localStorage.removeItem(KEY)
  }

}
