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
import {ActivatedRoute, Params} from '@angular/router'

import {isMobile} from '../../app.component'

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.sass']
})
export class LogoutComponent {

  isMobile: boolean
  message: string
  error: string

  constructor(route: ActivatedRoute) {
    this.isMobile = isMobile
    this.message = route.snapshot.params.message
    if (this.message == 'null' || this.message == 'undefined') {
      this.message = 'Come back soon'
    }
    this.error = route.snapshot.params.error
  }

}
