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

import {isMobile} from '../../app.component'
import {Themes} from '../../utils/themes'

import {EditorConfigService} from '../../services/editor-config.service'

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
  editorConfig: Object
  _runCommands: string[]
  @ViewChild('editor') editor

  constructor(private editorConfigService: EditorConfigService) {
    this.isMobile = isMobile
    this.themes = Themes
    this.editorConfig = editorConfigService.getConfig()
    this.selectedTheme = this.editorConfig['theme']
  }

  ngAfterViewInit() {

  }

  get runCommands(): string {
    return 'Hello'
  }

  set runCommands(value: string) {
    console.log('set')
  }

  openRunCommandsModal() {
    this.runCommandsModal = true
    setTimeout(() => {
      this.editor.instance.refresh()
    }, 700)
  }

  onClick(theme: string) {
    this.selectedTheme = theme
    this.editorConfigService.setOption('theme', this.selectedTheme)
  }

}
