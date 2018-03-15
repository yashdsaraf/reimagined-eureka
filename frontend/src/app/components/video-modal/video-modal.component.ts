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
import {DomSanitizer} from '@angular/platform-browser'

import {
  ComponentModalConfig,
  ModalSize,
  SuiModal
} from 'ng2-semantic-ui'

import {isMobile} from '../../app.component'

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
    <a class="ui icon button" [class.tiny]="isMobile" [attr.href]="url" target="_blank">
      View in full screen
      <i class="expand icon"></i>
    </a>
    <button type="button" class="ui icon button" [class.tiny]="isMobile" (click)="watchLater()">
      Watch it later
      <i class="clock icon"></i>
    </button>
    <button type="button" class="ui negative icon button" [class.tiny]="isMobile" (click)="skipVideo()">
      Skip video
      <i class="forward icon"></i>
    </button>
  </div>
  `,
  styleUrls: ['./video-modal.component.sass']
})
export class VideoModalComponent implements OnInit {

  isMobile: boolean

  constructor(
    public modal: SuiModal<IVideoModalContext, void, void>,
    public sanitizer: DomSanitizer
  ) {
    this.isMobile = isMobile
  }

  ngOnInit() {
    if (localStorage.getItem('skip-tut-video') == 'true') {
      this.modal.deny(undefined)
    }
  }

  get url() {
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.modal.context.link)
  }

  skipVideo() {
    localStorage.setItem('skip-tut-video', 'true')
    this.modal.deny(undefined)
  }

  watchLater() {
    localStorage.setItem('skip-tut-video', 'false')
    this.modal.deny(undefined)
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
