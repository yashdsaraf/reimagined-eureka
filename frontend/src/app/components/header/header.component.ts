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
  OnInit
} from '@angular/core'

import {AuthService} from '../../services/auth.service'
import {isMobile} from '../../app.component'
import {LogoutService} from '../../services/logout.service'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  isHeaderOpen: boolean
  isMobile: boolean

  constructor(
    private authService: AuthService,
    private logoutService: LogoutService
  ) {
    this.isMobile = isMobile
  }

  ngOnInit(): void {
    this.isHeaderOpen = !this.isMobile
  }

  getRole(): string {
    return this.authService.getRole()
  }

  logout() {
    this.logoutService.logout()
  }

}
