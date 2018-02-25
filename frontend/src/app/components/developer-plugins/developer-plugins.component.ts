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

import {isMobile} from '../../app.component'
import {DeveloperService} from '../../services/developer.service'
import {FlashMessagesService} from 'angular2-flash-messages'
import {ProgressBarService} from '../../services/progress-bar.service'
import {Plugin} from '../../models/plugin'
import {decodeError} from '../../utils/general-utils'

@Component({
  selector: 'app-developer-plugins',
  templateUrl: './developer-plugins.component.html',
  styleUrls: ['./developer-plugins.component.sass']
})
export class DeveloperPluginsComponent implements OnInit {

  _search: string
  isMobile: boolean
  plugins: Plugin[]
  currentPlugin: Plugin = {
    name: '',
    description: '',
    status: '',
    plugin_file: ''
  }
  successOptions = {cssClass: 'ui success message', timeout: 4000}
  errorOptions = {cssClass: 'ui error message', timeout: 4000}
  _authModal: boolean
  _createModal: boolean
  _deleteModal: boolean
  _editModal: boolean

  constructor(
    private developerService: DeveloperService,
    private flashMessagesService: FlashMessagesService,
    private progressBarService: ProgressBarService
  ) {
    this._authModal = false
    this._createModal = false
    this._deleteModal = false
    this._editModal = false
  }

  ngOnInit() {
    this.getPlugins(this.search)
  }

  getPlugins(value?: string) {
    this.developerService.getPlugins(value).
      subscribe(
      data => this.plugins = data
      )
  }

  updatePlugin() {
    this.developerService.updatePlugin(this.currentPlugin)
      .subscribe(data => {
        this.flashMessagesService.show('Plugin updated successfully', this.successOptions)
        this.refresh()
      }, err => {
        this.flashMessagesService.show(decodeError(err), this.errorOptions)
      })
  }

  deletePlugin() {
    this._deleteModal = false
    this.developerService.deletePlugin(this.currentPlugin.name)
      .subscribe(data => {
        this.flashMessagesService.show('Plugin deleted successfully', this.successOptions)
        this.refresh()
      }, err => {
        this.flashMessagesService.show(decodeError(err), this.errorOptions)
      })
  }

  createPlugin() {
    this.developerService.createPlugin(this.currentPlugin)
      .subscribe(data => {
        this.flashMessagesService.show('Plugin created successfully', this.successOptions)
        this.refresh()
      }, err => {
        this.flashMessagesService.show(decodeError(err), this.errorOptions)
      })
  }

  deleteModal(plugin: Plugin) {
    this._deleteModal = true
    this.currentPlugin = plugin
  }

  editModal() {
    this._editModal = true
  }

  createModal() {
    this._createModal = true
  }

  refresh() {
    this.getPlugins(this.search)
  }

  set search(value: string) {
    this._search = value
    this.getPlugins(value)
  }

  get search(): string {
    return this._search
  }

}
