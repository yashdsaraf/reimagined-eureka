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
  OnInit,
  QueryList,
  ViewChildren
} from '@angular/core'
import {DomSanitizer} from '@angular/platform-browser'

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

  @ViewChildren('editor') editor: QueryList<any>
  _search: string
  isMobile: boolean
  plugins: Plugin[]
  currentPlugin: Plugin = {
    name: '',
    description: '',
    pluginFile: ''
  }
  _plugin_file =  {
    mode: '',
    dockerfile: '',
    runCmd: []
  }
  successOptions = {cssClass: 'ui success message', timeout: 4000}
  errorOptions = {cssClass: 'ui error message', timeout: 4000}
  otp: number
  currentOperation: string
  otpDownloadLink: any
  _authModal: boolean
  _createModal: boolean
  _deleteModal: boolean
  _editModal: boolean

  constructor(
    private developerService: DeveloperService,
    private flashMessagesService: FlashMessagesService,
    private progressBarService: ProgressBarService,
    private sanitizer: DomSanitizer
  ) {
    this.isMobile = isMobile
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
    this.progressBarService.show(null, 'Updating plugin')
    this.developerService.updatePlugin(this.currentPlugin, this.otp.toString())
      .subscribe(data => {
        this.progressBarService.dismiss()
        this.flashMessagesService.show('Plugin updated successfully', this.successOptions)
        this.refresh()
      }, err => {
        this.progressBarService.dismiss()
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
    this.progressBarService.show(null, 'Creating plugin')
    this.developerService.createPlugin(this.currentPlugin, this.otp.toString())
      .subscribe(data => {
        this.progressBarService.dismiss()
        this.flashMessagesService.show('Plugin created successfully', this.successOptions)
        this.refresh()
      }, err => {
        this.progressBarService.dismiss()
        this.flashMessagesService.show(decodeError(err), this.errorOptions)
      })
  }

  authModal() {
    this.currentPlugin.pluginFile = JSON.stringify(this._plugin_file)
    this._editModal = false
    this.otpDownloadLink = null
    this._authModal = true
    this.developerService.getOtp().subscribe(
      (data: Blob) => this.otpDownloadLink = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(data))
    )
  }

  deleteModal(plugin: Plugin) {
    this._deleteModal = true
    this.currentPlugin = plugin
  }

  editModal(plugin: Plugin) {
    this.refresh()
    this.currentOperation = 'update'
    this.currentPlugin = plugin
    this._plugin_file = JSON.parse(plugin.pluginFile)
    this._editModal = true
  }

  createModal() {
    this.refresh()
    this.resetCurrentPlugin()
    this.currentOperation = 'create'
    this._editModal = true
  }

  approveAuthModal() {
    this._authModal = false
    switch(this.currentOperation) {
      case 'create':
        this.createPlugin()
        break
      case 'update':
        this.updatePlugin()
        break
    }
  }

  refresh() {
    setTimeout(() => {
      this.editor.forEach(i => i.instance.refresh())
    }, 100)
    this.getPlugins(this.search)
  }

  resetCurrentPlugin() {
    this.currentPlugin = {
      name: '',
      description: '',
      status: 'PEN',
      pluginFile: ''
    }
    this._plugin_file =  {
      mode: '',
      dockerfile: '',
      runCmd: []
    }
  }

  isOtpValid(): boolean {
    return this.otp != null && this.otp >= 1000 && this.otp <= 9999
  }

  get _dockerfile(): string {
    return atob(this._plugin_file.dockerfile)
  }

  set _dockerfile(value: string) {
    this._plugin_file.dockerfile = btoa(value)
  }

  get _runcmd(): string {
    return this._plugin_file.runCmd.join('\n')
  }

  set _runcmd(value: string) {
    this._plugin_file.runCmd = value.split('\n')
  }

  set search(value: string) {
    this._search = value
    this.getPlugins(value)
  }

  get search(): string {
    return this._search
  }

}
