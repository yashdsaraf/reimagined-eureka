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

import {DebugElement} from '@angular/core'
import {
  ComponentFixture,
  TestBed,
  async
} from '@angular/core/testing'
import {By} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'

import {AceEditorComponent} from 'ng2-ace-editor'
import {SuiModule} from 'ng2-semantic-ui'

import {IndexComponent} from './index.component'

describe('IndexComponent', () => {

  let component: IndexComponent
  let debug: DebugElement
  let fixture: ComponentFixture<IndexComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AceEditorComponent,
        IndexComponent
      ],
      imports: [
        BrowserAnimationsModule,
        SuiModule
      ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(IndexComponent)
    component = fixture.componentInstance
    debug = fixture.debugElement
  })

  // TODO: Add tests for editor

})
