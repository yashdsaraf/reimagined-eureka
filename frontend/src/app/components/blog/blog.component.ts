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

import {
  Component,
  QueryList,
  ViewChildren
} from '@angular/core'

import {FlashMessagesService} from 'angular2-flash-messages'

import {BlogService} from '../../services/blog.service'
import {EditorConfigService} from '../../services/editor-config.service'
import {isMobile} from '../../app.component'
import {CodeSnippet} from '../../models/code-snippet'
import {decodeError} from '../../utils/general-utils'

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.sass']
})
export class BlogComponent {

  @ViewChildren('editor') editors: QueryList<any>
  isMobile: boolean
  _search: string
  editorConfig: Object
  snippets: CodeSnippet[]

  constructor(
    private blogService: BlogService,
    private flashMessagesService: FlashMessagesService,
    private editorConfigService: EditorConfigService
  ) {
    this.isMobile = isMobile
    this.snippets = []
    this.editorConfig = editorConfigService.getConfig()
  }

  ngAfterViewInit() {
    this.editors.forEach(editor => {
      editor.instance.setSize(null, '10vh')
      editor.instance.setOption('readOnly', true)
    })
    this.getSnippets()
  }

  set search(value: string) {
    this._search = value
    this.getSnippets()
  }

  get search(): string {
    return this._search
  }

  getSnippets() {
    this.blogService.getSnippets(this.search).subscribe(
      data => this.snippets = data,
      err => this.errHandler(err)
    )
  }

  errHandler(err) {
    this.flashMessagesService.show(decodeError(err), {
      cssClass: 'ui error message', timeout: 4000
    })
  }
}
