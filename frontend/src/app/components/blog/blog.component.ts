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

import {Component, ViewChild} from '@angular/core'

import {isMobile} from '../../app.component'
import {EditorConfigService} from '../../services/editor-config.service'

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.sass']
})
export class BlogComponent {

  isMobile: boolean
  _search: string
  editorConfig: Object
  @ViewChild('editor') editor

  constructor(
    private editorConfigService: EditorConfigService
  )
  {
    this.isMobile = isMobile
    this.editorConfig = editorConfigService.getConfig()
  }

  ngAfterViewInit(){
    this.editor.instance.setSize(null, '10vh')
  }

  set search(value: string) {
    this._search = value
    this.getSharedCode(value)
  }

  get search(): string {
    return this._search
  }

  getSharedCode(value?: string) {
    // this.shareService.getSharedCode(value).
    //   subscribe(
    //     data => this.sharedCode = data
    //   )
  }
}
