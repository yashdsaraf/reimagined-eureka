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
import {CodeSnippet} from '../models/code-snippet'

@Injectable()
export class BlogService {

  constructor(private http: HttpClient) {}

  getSnippets(title?: string): Observable<CodeSnippet[]> {
    let params: HttpParams
    if (title !== null && title !== undefined) {
      params = new HttpParams().append('title', title)
    } else {
      params = new HttpParams()
    }
    return this.http.get<CodeSnippet[]>('/api/blog', {params})
  }

  getSnippet(title: string): Observable<CodeSnippet> {
    return this.http.get<CodeSnippet>(`/api/blog/${title}`)
  }

  createSnippet(snippet: CodeSnippet): Observable<any> {
    return this.http.post('/api/blog/create', snippet, {responseType: 'text'})
  }

  updateSnippet(snippet: CodeSnippet): Observable<any> {
    return this.http.post('/api/blog/update', snippet, {responseType: 'text'})
  }

  deleteSnippet(title: string): Observable<any> {
    let params = new HttpParams().append('title', title)
    return this.http.delete('/api/blog', {params, responseType: 'text'})
  }

  checkTitle(title: string): Observable<any> {
    title = btoa(title)
    return this.http.get(`/api/blog/check/${title}`, {responseType: 'text'})
  }

}
