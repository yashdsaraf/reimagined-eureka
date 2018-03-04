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
import {Tool} from '../../models/tool'

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent {

  @Input() isNavOpen: boolean
  @Output() isNavOpenChange = new EventEmitter<boolean>()
  @Output('executedTool') executedTool = new EventEmitter<string>()
  isMobile: boolean
  tools: Tool[] = [
    {name: 'Run', icon: 'play'},
    {name: 'Save', icon: 'save'},
    {name: 'Zoom-in', icon: 'zoom'},
    {name: 'Zoom-out', icon: 'zoom out'},
    {name: 'Share', icon: 'share'}
  ]

  constructor() {
    this.isMobile = isMobile
  }

  onClick(tool: string) {
    this.executedTool.emit(tool)
  }

}
