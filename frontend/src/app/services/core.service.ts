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
  HttpClient,
  HttpParams
} from '@angular/common/http'
import {Observable} from 'rxjs/Observable'

import {Output} from '../models/output'

@Injectable()
export class CoreService {

  constructor(private http: HttpClient) { }

  public runProject(code: object): Observable<Output> {
    let formData = new FormData()
    for (let file in code) {
      formData.append(file, code[file])
    }
    return this.http.post<Output>('/api/core/run', formData)
  }

  public quickSetup(lang: string, projectName: string, entrypoint: string): Observable<any> {
    let params = new HttpParams().append('project', projectName).append('entrypoint', entrypoint)
    return this.http.get(`/api/setup/${lang}`, {params, responseType: 'text'})
  }

}
