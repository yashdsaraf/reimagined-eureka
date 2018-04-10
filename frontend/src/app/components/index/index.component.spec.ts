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

import {CodemirrorModule} from 'ng2-codemirror'
import {SuiModule} from 'ng2-semantic-ui'

import {FileExComponent} from '../file-ex/file-ex.component'
import {IndexComponent} from './index.component'
import {OutputComponent} from '../output/output.component'
import {ToolbarComponent} from '../toolbar/toolbar.component'

describe('IndexComponent', () => {

  let component: IndexComponent
  let debug: DebugElement
  let fixture: ComponentFixture<IndexComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FileExComponent,
        IndexComponent,
        OutputComponent,
        ToolbarComponent
      ],
      imports: [
        CodemirrorModule,
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

  it('should show navbar in desktop screen', () => {
    fixture.detectChanges()
    expect(component.isNavOpen).toBe(true)
    let element = debug.query(By.css('#file-ex'))
    expect(element).not.toBe(null)
  })

  it('should hide navbar in mobile screen', () => {
    component.isMobile = true
    fixture.detectChanges()
    expect(component.isNavOpen).toBe(false)
    let element = debug.query(By.css('#file-ex'))
    expect(element).toBe(null)
  })

  // TODO: Add tests for editor

})
