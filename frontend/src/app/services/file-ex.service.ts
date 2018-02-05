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

@Injectable()
export class FileExService {

  constructor(private http: HttpClient) {}

  public getFileTree(): Observable<any> {
    return this.http.get('/api/file-ex')
  }

  public create(file: string, parent: string, isDir: boolean): Observable<any> {
    let formData = new FormData()
    formData.append('file', file)
    formData.append('parent', parent)
    formData.append('isDir', isDir.toString())
    return this.http.post('/api/file-ex', formData, {responseType: 'text'})
  }

  public delete(file: string, parent: string): Observable<any> {
    let params = new HttpParams()
      .append('file', file)
      .append('parent', parent)
    return this.http.delete('/api/file-ex', {params, responseType: 'text'})
  }

  public rename(file: string, parent: string, newname: string): Observable<any> {
    let formData = new FormData()
    formData.append('file', file)
    formData.append('parent', parent)
    formData.append('newname', newname)
    return this.http.post('/api/file-ex/rename', formData, {responseType: 'text'})
  }

}
