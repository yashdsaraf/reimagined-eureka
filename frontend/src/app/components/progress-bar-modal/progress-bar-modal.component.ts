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

import {Component} from '@angular/core'

import {
  ComponentModalConfig,
  ModalSize,
  SuiModal
} from 'ng2-semantic-ui'

interface IProgressBarModalContext {
  title:string;
  content:string;
}

@Component({
  selector: 'app-progress-bar-modal',
  template: `
  <div class="header">{{modal.context.title}}</div>
  <sui-progress id="progress-bar" class="active inverted" [ngClass]="color" value="100" [showProgress]="false" [autoSuccess]="false">
  </sui-progress>
  <p>{{modal.context.content}} <i class="notched circle loading icon"></i></p>
  `,
  styleUrls: ['progress-bar-modal.component.sass']
})
export class ProgressBarModalComponent {

  colors = []
  defaultColors = ['teal', 'blue', 'green']
  color = this.defaultColors[0]

  constructor(
    private modal: SuiModal<IProgressBarModalContext, void, void>
  ) {
    this.changeColors()
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  async changeColors() {
    while (true) {
      if (this.colors.length == 0) {
        this.colors = this.defaultColors.slice()
      }
     this.color = this.colors.pop()
     await this.sleep(2000)
    }
  }

}

export class ProgressBarModal extends ComponentModalConfig<IProgressBarModalContext, void, void> {
  constructor(title: string, content: string, size = ModalSize.Small) {
    super(ProgressBarModalComponent, {title, content})
    this.isBasic = true
    this.isClosable = false
    this.transitionDuration = 200
    this.size = size
  }
}
