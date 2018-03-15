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
import {DomSanitizer} from '@angular/platform-browser'

import {
  ComponentModalConfig,
  ModalSize,
  SuiModal
} from 'ng2-semantic-ui'

interface IVideoModalContext {
  link: string
}

declare const $: any

@Component({
  selector: 'app-video-modal',
  template: `
  <div id="container">
    <iframe [src]="url" frameborder="0" allow="autoplay;  encrypted-media"></iframe>
  </div>
  <div class="actions">
  <a [attr.href]="url" target="_blank">Click me! (Full screen)</a>
  </div>
  `,
  styleUrls: ['./video-modal.component.sass']
})
export class VideoModalComponent {

  constructor(
    public modal: SuiModal<IVideoModalContext, void, void>,
    public sanitizer: DomSanitizer
  ) {}

  get url() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.modal.context.link)
  }

}

export class VideoModal extends ComponentModalConfig<IVideoModalContext, void, void> {
  constructor(link: string, size = ModalSize.Small) {
    super(VideoModalComponent, {link})
    this.isClosable = true
    this.isBasic = true
    this.transitionDuration = 200
  }
}
