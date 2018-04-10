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
  OnInit,
  Output,
  Renderer
} from '@angular/core'

@Component({
  selector: 'app-link-copy-modal',
  templateUrl: './link-copy-modal.component.html',
  styleUrls: ['./link-copy-modal.component.sass']
})
export class LinkCopyModalComponent implements OnInit {

  @Input() title: string
  @Output() titleChange = new EventEmitter<string>()
  sharedLink: string
  linkCopied: boolean

  constructor(private renderer: Renderer) {
    this.linkCopied = false
  }

  ngOnInit() {
    this.sharedLink = `${window.location.origin}/blog/${encodeURIComponent(btoa(this.title))}`
    setTimeout(() => {
      this.selectLink()
    }, 250)
    this.linkCopied = false
  }

  copyLink() {
    this.selectLink()
    this.linkCopied = document.execCommand('copy')
  }

  selectLink() {
    let link: HTMLElement = document.getElementById('link')
    this.renderer.invokeElementMethod(link, 'select')
  }

  isCopySupported(): boolean {
    return document.queryCommandSupported('copy')
  }

}
