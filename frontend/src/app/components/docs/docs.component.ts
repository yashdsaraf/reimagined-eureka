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

import {Component} from '@angular/core'
import {Http} from '@angular/http'
import {ActivatedRoute} from '@angular/router'

import {DocItem, DOCS} from './docs-content'

@Component({
  selector: 'app-docs',
  templateUrl: './docs.component.html',
  styleUrls: ['./docs.component.sass']
})
export class DocsComponent {

  menu: DocItem[]
  content: string

  constructor(
    private route: ActivatedRoute,
    private http: Http
  ) {
    this.menu = DOCS
    let page = route.snapshot.params['page']
    if (page !== undefined && page !== null) {
      page = page.split(',').join('/')
      this.loadUrlIntoDiv('assets/docs/' + page)
    } else {
      this.loadUrlIntoDiv('assets/docs/index.html')
    }
  }

  loadUrlIntoDiv(url: string) {
    this.http.get(url).subscribe(
      (data: any) => this.content = data._body
    )
  }

}
