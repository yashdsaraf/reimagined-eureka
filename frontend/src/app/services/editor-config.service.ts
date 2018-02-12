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
import {Subject} from 'rxjs/Subject'
import {Observable} from 'rxjs/Observable'

@Injectable()
export class EditorConfigService {

  private subject: Subject<Object> = new Subject()
  emitter: Observable<Object> = this.subject.asObservable()
  defaultEditorConfig = {
    lineNumbers: true,
  }
  editorConfig = {}

  constructor() {
    let localConfigJson = localStorage.getItem('editor-config')
    try {
      this.editorConfig = JSON.parse(localConfigJson)
    } catch (e) {
      this.editorConfig = this.defaultEditorConfig
    }
    if (this.editorConfig == null) {
      this.editorConfig = this.defaultEditorConfig
    }
    this.subject.next(this.editorConfig)
  }

  setOption(option: string, value: string) {
    this.editorConfig[option] = value
    this.updateConfig()
  }

  updateConfig() {
    localStorage.setItem('editor-config', JSON.stringify(this.editorConfig))
    this.subject.next(this.editorConfig)
  }

  getConfig() {
    return this.editorConfig
  }

}
