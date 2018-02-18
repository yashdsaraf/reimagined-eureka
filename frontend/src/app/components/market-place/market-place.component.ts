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

import {Component, OnInit} from '@angular/core'

import {FlashMessagesService} from 'angular2-flash-messages'
import {ProgressBarService} from '../../services/progress-bar.service'
import {isMobile} from '../../app.component'
import {Plugin} from '../../models/plugin'
import {PluginsService} from '../../services/plugins.service'
import {decodeError} from '../../utils/general-utils';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.sass'],
})
export class MarketPlaceComponent implements OnInit {

  contacts: Object = {
    email: '',
    phone: ''
  }
  isMobile: boolean
  plugins: Plugin[] = []
  _search: string

  constructor(
    private flashMessagesService: FlashMessagesService,
    private pluginsService: PluginsService,
    private progressBarService: ProgressBarService
  ) {
    this.isMobile = isMobile
  }

  ngOnInit() {
    this.getPlugins()
  }

  getIdenticonObject(value: string, size: number) {
    let obj = {value, size}
    return JSON.stringify(obj)
  }

  getPlugins(value?: string) {
    this.pluginsService.getPlugins(value).
      subscribe(
        data => this.plugins = data
      )
  }

  installPlugin(name: string) {
    this.progressBarService.show(null, "Installing plugin")
    this.pluginsService.installPlugin(name)
      .subscribe(data => {
        this.progressBarService.dismiss()
        this.flashMessagesService.show('Plugin installed to current project!', {
          cssClass: 'ui success message', timeout: 4000
        })
        this.getPlugins(this.search)
      }, err => {
        this.progressBarService.dismiss()
        this.flashMessagesService.show(decodeError(err), {
          cssClass: 'ui error message', timeout: 4000
        })
      })
  }

  set search(value: string) {
    this._search = value
    this.getPlugins(value)
  }

  get search(): string {
    return this._search
  }

}
