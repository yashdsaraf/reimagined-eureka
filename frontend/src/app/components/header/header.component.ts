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
import {Router, NavigationEnd} from '@angular/router'

import {AuthService} from '../../services/auth.service'
import {DeveloperService} from '../../services/developer.service'
import {DisplayNameService} from '../../services/display-name.service'
import {IndexService} from '../../services/index.service'
import {LogoutService} from '../../services/logout.service'
import {isMobile} from '../../app.component'
import {decodeError} from '../../utils/general-utils'

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass']
})
export class HeaderComponent implements OnInit {

  isHeaderOpen: boolean
  isMobile: boolean
  isEditorBtnVisible: boolean
  devPrompt: boolean
  isFormLoading: boolean
  isFormError: boolean
  formError: string
  publicKey = ''

  constructor(
    private authService: AuthService,
    private developerService: DeveloperService,
    private displayNameService: DisplayNameService,
    private indexService: IndexService,
    private logoutService: LogoutService,
    private router: Router
  ) {
    this.isMobile = isMobile
    this.isHeaderOpen = true
    this.devPrompt = false
    router.events.subscribe((_: NavigationEnd) => this.isEditorBtnVisible = !_.url.startsWith('/index'))
  }

  ngOnInit(): void {
    this.isHeaderOpen = !this.isMobile
  }

  get name(): string {
    let name = this.displayNameService.getName()
    if (name == null || name == undefined) {
      return ' '
    }
    name = name.toLowerCase()
    name = name.split(' ').map((e) => e.charAt(0).toUpperCase() + e.slice(1))
      .join(' ')
    return name.length <= 20 ? name : name.split(' ')[0]
  }

  getIdenticonObject() {
    let obj = {
      value: this.name,
      size: 60
    }
    return JSON.stringify(obj)
  }

  getRole(): string {
    return this.authService.getRole()
  }

  logout() {
    this.logoutService.logout()
  }

  openDevPrompt() {
    this.devPrompt = true
  }

  submitKey() {
    this.isFormError = false
    this.formError = ''
    this.isFormLoading = true
    this.developerService.getDeveloperAccess(this.publicKey)
      .then(() => {
        this.isFormLoading = false
        this.devPrompt = false
        this.publicKey = ''
        this.logout()
      }).catch(err => {
        this.isFormLoading = false
        this.isFormError = true
        this.formError = decodeError(err)
      })
  }

}
