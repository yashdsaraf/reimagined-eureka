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
import {Subject} from 'rxjs/Rx'
import {Observable} from 'rxjs/Observable'

export interface IndexTab {
  id: string
  name: string
  content: string
  isActive?: boolean
}

@Injectable()
export class IndexService {

  private tabsChanged: Subject<IndexTab[]> = new Subject()
  emitter: Observable<IndexTab[]> = this.tabsChanged.asObservable()
  private tabs: IndexTab[] = []

  constructor() {}

  public addTab(id: string, name: string, content: string) {
    // Only open tabs with unique file ids
    let tab = this.tabs.find(i => i.id == id)
    if (tab == null) {
      this.tabs.push({id, name, content})
      this.tabsChanged.next(this.tabs)
    }
  }

  public removeTab(id: string) {
    this.tabs = this.tabs.filter(i => i.id != id)
    this.tabsChanged.next(this.tabs)
  }

  public clearAll() {
    this.tabs = []
    this.tabsChanged.next(this.tabs)
  }

  public openTab(id: string) {
    this.tabs = this.tabs.map((i: IndexTab) => {
      i.isActive = i.id == id
      return i
    })
    this.tabsChanged.next(this.tabs)
  }

}
