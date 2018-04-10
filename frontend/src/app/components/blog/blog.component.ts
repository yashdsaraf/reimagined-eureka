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
  Input,
  QueryList,
  ViewChildren
} from '@angular/core'
import {ActivatedRoute} from '@angular/router'

import {FlashMessagesService} from 'angular2-flash-messages'

import {AdminService} from '../../services/admin.service'
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

  @Input('isAdmin') isAdmin: boolean
  @ViewChildren('editor') editors: QueryList<any>
  isMobile: boolean
  _search: string
  _editorConfig: Object
  additionalConfig: Object
  snippets: CodeSnippet[]
  singleMode: boolean
  sharedLink: string
  deleteTitle: string

  constructor(
    private adminService: AdminService,
    private blogService: BlogService,
    private editorConfigService: EditorConfigService,
    private flashMessagesService: FlashMessagesService,
    private route: ActivatedRoute
  ) {
    this.isMobile = isMobile
    this.snippets = []
    this._editorConfig = editorConfigService.getConfig()
    let title = route.snapshot.params.title
    if (title != null && title.trim() != '') {
      this.singleMode = true
    } else {
      this.singleMode = false
    }
    this.sharedLink = null
    this.deleteTitle = null
    this.additionalConfig = {
      readOnly: true
    }
  }

  ngAfterViewInit() {
    this.getSnippets()
  }

  @Input('search') set search(value: string) {
    this._search = value
    this.getSnippets()
  }

  get search(): string {
    return this._search
  }

  getSnippets() {
    if (this.singleMode) {
      let title = decodeURIComponent(this.route.snapshot.params.title)
      this.blogService.getSnippet(title).subscribe(
        data => this.snippets[0] = data,
        err => this.errHandler(err)
      )
    } else {
      this.blogService.getSnippets(this.search).subscribe(
        data => this.snippets = data,
        err => this.errHandler(err)
      )
    }
    this.refresh()
  }

  deleteSnippet() {
    this.adminService.deleteSnippet(this.deleteTitle).subscribe(
      data => {
        this.getSnippets()
      },
      err => {
        this.errHandler(err)
      }
    )
    this.deleteTitle = null
  }

  refresh() {
    setTimeout(() => {
      this.editors.forEach(editor => {

      })
    }, 100)
  }

  errHandler(err) {
    this.flashMessagesService.show(decodeError(err), {
      cssClass: 'ui error message', timeout: 4000
    })
  }

  set editorConfig(value: Object) {
    this._editorConfig = value
  }

  get editorConfig(): Object {
    return Object.assign({}, this._editorConfig, this.additionalConfig)
  }

}
