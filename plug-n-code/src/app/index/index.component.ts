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
} from '@angular/core';
import {
  animate,
  keyframes,
  style,
  transition,
  trigger
} from '@angular/animations';
import 'brace/theme/eclipse';
import 'brace/mode/json';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass'],
  animations: [trigger('sidebarAnimation', [
    transition(':enter', [
      style({width: 0, opacity: 0}),
      animate(400, keyframes([
        style({width: '0', opacity: .25, offset: 0}),
        style({width: '*', opacity: .55, offset: .5}),
        style({width: '*', opacity: 1, offset: 1})
      ]))
    ]),
    transition(':leave', [
      style({width: '*', opacity: 1}),
      animate(300, keyframes([
        style({width: '*', opacity: 1, offset: 0}),
        style({width: '0', opacity: .55, offset: 1})
      ]))
    ])
  ])]
})
export class IndexComponent {
  title = 'Plug n\' Code';

  @ViewChild('editor') editor;
  isNavOpen: boolean = true;
  isMobile: boolean = false;

  constructor() {
    this.isMobile = window.screen.width <= 768;
    this.isNavOpen = !this.isMobile;
  }

  ngAfterViewInit() {
    this.editor.setTheme('eclipse');
    this.editor.setMode('json');
    this.editor.getEditor().setOptions({
      enableBasicAutocompletion: true
    });

    this.editor.getEditor().commands.addCommand({
      name: 'showOtherCompletions',
      bindKey: 'Ctrl-.',
      exec: function (editor) {}
    })
  }

}
