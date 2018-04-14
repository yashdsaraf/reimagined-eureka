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

import {IndexTab} from './index.service'
import {Output} from '../models/output'

@Injectable()
export class CoreService {

  constructor(private http: HttpClient) { }

  public runProject(code: IndexTab[]): Observable<Output> {
    let formData = this.getCodeFormData(code)
    return this.http.post<Output>('/api/project/run', formData)
  }

  public sync(code: IndexTab[]): Observable<any> {
    let formData = this.getCodeFormData(code)
    return this.http.post('/api/project/sync', formData)
  }

  public create(lang: string, projectName: string, entrypoint: string): Observable<any> {
    let params = new HttpParams()
      .append('project', projectName)
      .append('entrypoint', entrypoint)
      .append('plugin', btoa(lang))
    return this.http.get('/api/project/create', {params, responseType: 'text'})
  }

  public close(): Observable<any> {
    return this.http.delete('/api/project/close', {responseType: 'text'})
  }

  public check(): Observable<any> {
    return this.http.get('/api/project', {responseType: 'text'})
  }

  public save(): Observable<any> {
    return this.http.get('/api/project/save')
  }

  public openFromLink(link: string): Observable<any> {
    let formData = new FormData()
    formData.append('link', link)
    return this.http.post('/api/project/open/link', formData, {responseType: 'text'})
  }

  public openFromFile(file: File): Observable<any> {
    let formData = new FormData()
    formData.append('file', file)
    return this.http.post('/api/project/open/file', formData, {responseType: 'text'})
  }

  public importFromLink(link: string, lang: string, projectName: string, entrypoint: string): Observable<any> {
    let formData = this.getImportFormData(lang, projectName, entrypoint)
    formData.append('link', link)
    return this.http.post('/api/project/import/link', formData, {responseType: 'text'})
  }

  public importFromFile(file: File, lang: string, projectName: string, entrypoint: string): Observable<any> {
    let formData = this.getImportFormData(lang, projectName, entrypoint)
    formData.append('file', file)
    return this.http.post('/api/project/import/file', formData, {responseType: 'text'})
  }

  private getImportFormData(lang: string, projectName: string, entrypoint: string): FormData {
    let formData = new FormData()
    formData.append('project', projectName)
    formData.append('entrypoint', entrypoint)
    formData.append('plugin', lang)
    return formData
  }

  private getCodeFormData(code: IndexTab[]): FormData {
    let formData = new FormData()
    if (code != null) {
      for (let file of code) {
        formData.append(file.name, file.content)
      }
    }
    return formData
  }

}
