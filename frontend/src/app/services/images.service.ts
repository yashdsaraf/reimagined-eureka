/*
 * Copyright 2018 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
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
  HttpClient,
  HttpHeaders
} from '@angular/common/http'
import {Observable} from 'rxjs/Observable'

import {HttpUtils} from '../utils/http-utils'

@Injectable()
export class ImagesService {

  constructor(private http: HttpClient) { }

  getImage(name: string): Observable<any> {
    return this.http.get(`/api/images/jpg/${name}`, {responseType: 'blob'})
  }

  getPlugins(): Observable<any> {
    return this.http.get('/api/images/plugins')
  }

  setHomeImage(file: File): Observable<any> {
    let formData = new FormData()
    formData.append('file', file)
    return this.http.post('/api/images/jpg/home', formData, {responseType: 'text'})
  }

}
