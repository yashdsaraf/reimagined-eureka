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
  Input
} from '@angular/core'

declare var $:any
@Component({
  selector: 'app-output',
  templateUrl: './output.component.html',
  styleUrls: ['./output.component.sass']
})
export class OutputComponent {

  _stdout: string
  _stderr: string
  showOutputIndicator: boolean
  showErrorIndicator: boolean

  constructor() {
    this.showOutputIndicator = false
    this.showErrorIndicator = false
  }


  @Input('stdout')
  set stdout(value: string) {
    if (value != null && value != '') {
      this.showOutputIndicator = true
    }
    this._stdout = value
  }

  get stdout(): string {
    return this._stdout
  }

  @Input('stderr')
  set stderr(value: string) {
    if (value != null && value != '') {
      this.showErrorIndicator = true
    }
    this._stderr = value
  }

  get stderr(): string {
    return this._stderr
  }

  ngAfterViewInit(){

  }

}
