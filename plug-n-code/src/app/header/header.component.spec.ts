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

import {HeaderComponent} from './header.component'

describe('HeaderComponent', () => {

  let component: HeaderComponent
  let debug: DebugElement
  let fixture: ComponentFixture<HeaderComponent>

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderComponent ]
    }).compileComponents()
  }))

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    debug = fixture.debugElement
  })

  it('should not show header-toggle button in desktop screen', () => {
    fixture.detectChanges()
    let element = debug.query(By.css('#header-toggle'))
    expect(element).toBe(null)
  })

  it('should show right-header in desktop screen', () => {
    fixture.detectChanges()
    expect(component.isHeaderOpen).toBe(true)
    let element = debug.query(By.css('#right-header'))
    expect(element).not.toBe(null)
  })  

  it('should show header-toggle button in mobile screen', () => {
    component.isMobile = true
    fixture.detectChanges()
    let element = debug.query(By.css('#header-toggle'))
    expect(element).not.toBe(null)
  })

  it('should hide right-header in mobile screen', () => {
    component.isMobile = true
    fixture.detectChanges()
    expect(component.isHeaderOpen).toBe(false)
    let element = debug.query(By.css('#right-header'))
    expect(element).toBe(null)
  })

})
