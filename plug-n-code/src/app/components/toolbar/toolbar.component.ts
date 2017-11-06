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

export interface Tool {
  name: string,
  icon: string
}

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.sass']
})
export class ToolbarComponent {

  @Input() isNavOpen: boolean
  @Output() isNavOpenChange = new EventEmitter<boolean>()
  isMobile: boolean
  lastIndex = 0
  tools: Tool[] = [
    {
      name: 'Run',
      icon: 'play'
    },
    {
      name: 'Stop',
      icon: 'stop'
    },
    {
      name: 'New',
      icon: 'file outline'
    },
    {
      name: 'Save',
      icon: 'save'
    },
    {
      name: 'Zoom-in',
      icon: 'zoom'
    },
    {
      name: 'Zoom-out',
      icon: 'zoom out'
    },
    {
      name: 'Share',
      icon: 'share'
    }
  ]

  constructor() {
    this.isMobile = isMobile
  }

  onClick(event: any) {
    let tool = this.getTool(event)
    console.log('tool:', tool)
  }

  scroll(reverse: boolean = false) {
    let elem: Element
    let tool: Tool
    if (reverse && this.lastIndex == 0 ||
        !reverse && this.lastIndex == this.tools.length) {
          return
    }
    while(this.lastIndex < this.tools.length && this.lastIndex >= 0) {
      tool = this.tools[this.lastIndex];
      elem = this.getToolElement(tool)
      if(!this.isInViewport(elem)) {
        elem.scrollIntoView()
        break
      }
      reverse ? this.lastIndex-- : this.lastIndex++
    }
    if (this.lastIndex >= this.tools.length) {
      this.lastIndex--
    } else if (this.lastIndex < 0) {
      this.lastIndex++
      this.getToolElement(this.tools[0]).scrollIntoView()
    }
  }

  getToolElement(tool: Tool): Element {
    let id = 'tool-' + tool.name.toLowerCase()
    return document.getElementById(id)
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

  /* Returns a boolean value based on whether the supplied element
  *  is visible in the viewport. (Not accurate)
  */
  isInViewport(elem: Element): boolean {
    if (this.isMobile) {
      let elemTop = elem.getBoundingClientRect().top;
      let elemBottom = elem.getBoundingClientRect().bottom;
      return (elemTop >= 0) && (elemBottom <= window.innerHeight)
    }
    let elemRight = elem.getBoundingClientRect().right;
    let elemLeft = elem.getBoundingClientRect().left;
    return (elemRight >= 0) && (elemLeft <= window.innerWidth)
  }

}
