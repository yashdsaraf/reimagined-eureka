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
  ViewChild
} from '@angular/core'

import {FlashMessagesService} from 'angular2-flash-messages/module/flash-messages.service'

import {isMobile} from '../../app.component'
import {Themes} from '../../utils/themes'
import {EditorConfigService} from '../../services/editor-config.service'
import {ProjectSettingsService} from '../../services/project-settings.service'

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent {

  isMobile: boolean
  themes: string[]
  selectedTheme: string
  runCommandsModal = false
  runCommands: string
  entrypoint: string
  editorConfig: Object
  resetLoading = false
  @ViewChild('editor') editor

  constructor(
    private editorConfigService: EditorConfigService,
    private flashMessagesService: FlashMessagesService,
    private projectSettingsService: ProjectSettingsService
  ) {
    this.isMobile = isMobile
    this.themes = Themes
    this.editorConfig = editorConfigService.getConfig()
    this.selectedTheme = this.editorConfig['theme']
  }

  ngAfterViewInit() {

  }

  openRunCommandsModal() {
    this.runCommandsModal = true
    setTimeout(() => {
      this.editor.instance.refresh()
    }, 700)
    this.projectSettingsService.getEntrypoint()
      .subscribe(
      data => this.entrypoint = data,
      err => this.flashMessagesService.show(
        this.decodeErr(err), {
          cssClass: 'ui error message',
          timeout: 4000
        }
      )
      )
    this.projectSettingsService.getRunCommands()
      .subscribe(
      data => {
        this.runCommands = data.join('\n')
        this.editor.instance.refresh()
      },
      err => this.flashMessagesService.show(
        this.decodeErr(err), {
          cssClass: 'ui error message',
          timeout: 4000
        }
      )
      )
  }

  resetRuncmds() {
    this.resetLoading = true
    this.projectSettingsService.getPluginRunCommands()
      .subscribe(data => {
        this.runCommands = data.join('\n')
        this.editor.instance.refresh()
        this.resetLoading = false
      }, err => {
        this.resetLoading = false
      })
  }

  saveSettings() {
    this.projectSettingsService.setEntryPoint(this.entrypoint)
      .subscribe(data => this.flashMessagesService.show(
        'Entrypoint updated successfully!', {
          cssClass: 'ui success message',
          timeout: 4000
        }
      ))
    this.projectSettingsService.setRunCommands(this.runCommands.split('\n'))
      .subscribe(data => this.flashMessagesService.show(
        'Run commands updated successfully!', {
          cssClass: 'ui success message',
          timeout: 4000
        }
      ))
  }

  onClick(theme: string) {
    this.selectedTheme = theme
    this.editorConfigService.setOption('theme', this.selectedTheme)
  }

  decodeErr(err: any) {
    if (err.hasOwnProperty("error_description")) {
      return err['error_description']
    }
    if (err.hasOwnProperty('error')) {
      return err['error']
    }
    return err
  }

}
