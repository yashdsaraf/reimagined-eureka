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

import {Component, ViewChild} from '@angular/core';
import 'brace/theme/eclipse';
import 'brace/mode/json';
import 'brace/ext/searchbox';
import 'brace/ext/language_tools';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass']
})
export class IndexComponent {
  title = 'Plug n\' Code';

  @ViewChild('editor') editor;
  @ViewChild('sidebar') sidebar;

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

  openNav(): void {
    this.sidebar.nativeElement.style.display = "flex"
  }

  closeNav(): void {
    this.sidebar.nativeElement.style.display = "none"
  }
}
