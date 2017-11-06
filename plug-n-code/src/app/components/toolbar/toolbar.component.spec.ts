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

import {SuiModule} from 'ng2-semantic-ui'

import {
  Tool,
  ToolbarComponent
} from './toolbar.component'

describe('ToolbarComponent', () => {

  let component: ToolbarComponent
  let debug: DebugElement
  let fixture: ComponentFixture<ToolbarComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToolbarComponent ],
      imports: [ SuiModule ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent)
    component = fixture.componentInstance
    debug = fixture.debugElement
  })

  it('should not show open-nav button in desktop screen', async() => {
    fixture.detectChanges()
    let element = debug.query(By.css('#open-nav'))
    expect(element).toBe(null)
  })

  it('should show open-nav button in mobile screen', async() => {
    component.isMobile = true
    fixture.detectChanges()
    let element = debug.query(By.css('#open-nav')).nativeElement
    expect(element).not.toBe(null)
  })

  it('getTool should get the tool from event', async() => {
    fixture.detectChanges()
    let expected: Tool = component.tools[0]
    let event = {path: [ {id: 'tool-' + expected.name.toLowerCase()} ]}
    let result: Tool = component.getTool(event)
    expect(result).toBe(expected)
  })

  it('getToolElement should get the element from tool', async() => {
    fixture.detectChanges()
    let tool: Tool = component.tools[0]
    let id = 'tool-' + tool.name.toLowerCase()
    let expected: Element = debug.query(By.css(id)).nativeElement
    let result: Element = component.getToolElement(tool)
    expect(result).toBe(expected)
  })

})
