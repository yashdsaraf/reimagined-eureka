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
  EventEmitter,
  Input,
  Output
} from '@angular/core'

import {isMobile} from '../../app.component'
import {AdminService} from '../../services/admin.service'
import {FlashMessagesService} from 'angular2-flash-messages'
import {Plugin} from '../../models/plugin'

@Component({
  selector: 'app-admin-plugins',
  templateUrl: './admin-plugins.component.html',
  styleUrls: ['./admin-plugins.component.sass']
})
export class AdminPluginsComponent {

  @Output('heading') heading = new EventEmitter()
  _search: string
  isMobile: boolean
  plugins: Plugin[]
  deletePluginName = ''
  approvePluginName = ''

  constructor(
    private adminService: AdminService,
    private flashMessagesService: FlashMessagesService
  ) {
    this.isMobile = isMobile
  }

  ngAfterViewInit() {
    setTimeout(() => this.heading.emit('Plugins'))
  }

  getPlugins(value?: string) {
    this.adminService.getPlugins(value).
      subscribe(
        data => this.plugins = data
      )
  }

  approvePlugin(name: string) {
    this.adminService.approvePlugin(name).
      subscribe(
        data => {
          this.getPlugins(this._search)
          this.flashMessagesService.show('Plugin approved!', {
            cssClass: 'ui success message', timeout: 4000
          })
        },
        err => {
          this.flashMessagesService.show(err.error, {
            cssClass: 'ui error message', timeout: 4000
          })
          console.log(err)
        }
      )
    this.approvePluginName = ''
  }

  deletePlugin(name: string) {
    this.adminService.deletePlugin(name).
      subscribe(
        data => {
          this.getPlugins(this._search)
          this.flashMessagesService.show('Plugin deleted!', {
            cssClass: 'ui success message', timeout: 4000
          })
        },
        err => {
          this.flashMessagesService.show(err.error, {
            cssClass: 'ui error message', timeout: 4000
          })
          console.log(err)
        }
      )
    this.deletePluginName = ''
  }

  @Input('search')
  set search(value: string) {
    this._search = value
    this.getPlugins(value)
  }

  get search(): string {
    return this._search
  }

}
