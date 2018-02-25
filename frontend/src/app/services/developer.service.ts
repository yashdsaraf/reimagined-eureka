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
import {HttpClient, HttpParams} from '@angular/common/http'
import {Observable} from 'rxjs/Observable'

import {Plugin} from '../models/plugin'

@Injectable()
export class DeveloperService {

  constructor(
    private http: HttpClient
  ) {}

  getDeveloperAccess(publicKey: string): Promise<any> {
    let formData = new FormData()
    formData.append('publicKey', publicKey)
    return new Promise<any>((resolve, reject) => {
      this.http.post('/api/developer/getaccess', formData)
        .subscribe(
          data => resolve(),
          err => {
            if (err.status != 200) {
              reject(err)
            } else {
              resolve()
            }
          }
        )
    })
  }

  getPlugins(name?: string): Observable<Plugin[]> {
    let params: HttpParams
    if (name !== null && name !== undefined) {
      params = new HttpParams().append('name', name)
    } else {
      params = new HttpParams()
    }
    return this.http.get<Plugin[]>('/api/developer/plugins', {params})
  }

  createPlugin(plugin: Plugin): Observable<any> {
    return this.http.post('/api/developer/plugin/create', plugin, {responseType: 'text'})
  }

  updatePlugin(plugin: Plugin): Observable<any> {
    return this.http.post('/api/developer/plugin/update', plugin, {responseType: 'text'})
  }

  deletePlugin(pluginName: string): Observable<any> {
    let params = new HttpParams().append('name', pluginName)
    return this.http.delete('/api/developer/plugin', {params, responseType: 'text'})
  }

}
