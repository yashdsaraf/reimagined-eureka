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
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Observable'

@Injectable()
export class ProjectSettingsService {

  constructor(private http: HttpClient) {}

  getRunCommands(): Observable<any> {
    return this.http.get('/api/project_config/runcmds')
  }

  getPluginRunCommands(): Observable<any> {
    return this.http.get('/api/project_config/default_runcmds')
  }

  setRunCommands(runcmds: string[]): Observable<any> {
    let formData = new FormData()
    formData.append('runcmds', JSON.stringify(runcmds))
    return this.http.post('/api/project_config/runcmds', formData, {responseType: 'text'})
  }

  getEntrypoint(): Observable<any> {
    return this.http.get('/api/project_config/entrypoint')
  }

  setEntryPoint(entrypoint: string): Observable<any> {
    let formData = new FormData()
    formData.append('entrypoint', entrypoint)
    return this.http.post('/api/project_config/entrypoint', formData, {responseType: 'text'})
  }
}
