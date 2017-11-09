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
  isMobile: boolean
  tools: Tool[] = [
    {name: 'Run', icon: 'play'},
    {name: 'Stop', icon: 'stop'},
    {name: 'New', icon: 'file outline'},
    {name: 'Save', icon: 'save'},
    {name: 'Zoom-in', icon: 'zoom'},
    {name: 'Zoom-out', icon: 'zoom out'},
    {name: 'Share', icon: 'share'}
  ]

  constructor() {
    this.isMobile = isMobile
  }

  onClick(event: any) {
    let tool = this.getTool(event)
    console.log('tool:', tool)
  }

  /* Iterate through the given element's DOM hierarchy to
  *  find the correct tool id e.g tool-save, and return the
  *  tool with the matching name from "tools" array.
  *  This is needed in case user clicks the icon rather than the button
  */
  getTool(event: any): Tool {
    let tool: Tool
    for (let node of event.path) {
      if (node.id !== undefined && node.id.startsWith('tool-')) {
        tool = this.tools
          .find(item => 'tool-' + item.name.toLowerCase() == node.id)
        break
      }
    }
    return tool
  }

}
