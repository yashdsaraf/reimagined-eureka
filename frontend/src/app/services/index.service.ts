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
import {Subject} from 'rxjs/RX'
import {Observable} from 'rxjs/Observable'

export interface IndexTab {
  name: string
  content: string
}

@Injectable()
export class IndexService {

  private countChanged: Subject<IndexTab[]> = new Subject()
  emitter: Observable<IndexTab[]> = this.countChanged.asObservable()
  private tabs: IndexTab[] = []

  constructor() {}

  public addTab(name: string, content: string) {
    // Only open tabs with *unique* names
    // if (this.search(name) !== undefined) {
    //   return
    // }
    this.tabs.push({name, content})
    this.countChanged.next(this.tabs)
  }

  public removeTab(name: string) {
    let tab = this.search(name)
    if (tab === undefined) {
      return
    }
    let index = this.tabs.indexOf(tab)
    this.tabs.splice(index, 1)
    this.countChanged.next(this.tabs)
  }

  public clearAll() {
    this.tabs = []
    this.countChanged.next(this.tabs)
  }

  public search(name: string): IndexTab {
    for (let tab of this.tabs) {
      if (tab.name == name) {
        return tab
      }
    }
    return undefined
  }

}
