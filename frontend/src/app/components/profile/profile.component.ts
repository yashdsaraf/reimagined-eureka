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
  ElementRef,
  Injector,
  OnInit,
  ViewChild
} from '@angular/core'
import {NgForm} from '@angular/forms'

import {FlashMessagesService} from 'angular2-flash-messages'

import {AuthService} from '../../services/auth.service'
import {DisplayNameService} from '../../services/display-name.service'
import {LogoutService} from '../../services/logout.service'
import {ProfileService} from '../../services/profile.service'
import {isMobile} from '../../app.component'
import {User} from '../../models/user'
import {decodeError} from '../../utils/general-utils'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.sass']
})
export class ProfileComponent {

  isMobile: boolean
  editable: boolean
  passModal: boolean
  user: User = {
    name: '',
    email: '',
    username: ''
  }
  password = ''
  newPassword = ''
  confirmPassword = ''
  loading = false
  @ViewChild('passwordField') passwordField: ElementRef

  constructor(
    private flashMessagesService: FlashMessagesService,
    private profileService: ProfileService,
    private injector: Injector,
    private displayNameService: DisplayNameService,
    private logoutService: LogoutService
  ) {
    this.isMobile = isMobile
    this.editable = false
    this.passModal = false
    this.refresh()
  }

  refresh() {
    this.profileService.getUserDetails().subscribe(
      data => this.user = data,
      err => this.errorHandler(err)
    )
    this.password = ''
    this.confirmPassword = ''
    this.newPassword = ''
  }

  openModal() {
    this.passModal = true
  }

  closeModal() {
    this.passModal = false
  }

  getIdenticonObject() {
    let obj = {
      value: this.user.name,
      size: 120
    }
    return JSON.stringify(obj)
  }

  errorHandler(err) {
    this.flashMessagesService.show(decodeError(err), {
      cssClass: 'ui error message', timeout: 4000
    })
    this.loading = false
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return
    }
    this.loading = true
    this.profileService.setUserDetails(this.user, this.password).subscribe(
      data => {
        let authService = this.injector.get(AuthService)
        authService.getTokens(this.user.username, this.password).subscribe(
          tokens => {
            authService.updateTokens(tokens.access_token, tokens.refresh_token)
            this.displayNameService.updateName(authService.getSavedTokens().access_token)
            this.refresh()
          },
          err => {
            this.refresh()
            this.logoutService.logout(null, decodeError(err))
          }
        )
        this.editable = false
        this.flashMessagesService.show('Profile updated successfully!', {
          cssClass: 'ui success message'
        })
        this.loading = false
      },
      err => this.errorHandler(err)
    )
  }

  onPasswordSubmit(form: NgForm) {
    if (!form.valid || this.newPassword != this.confirmPassword) {
      return
    }
    this.passModal = false
    this.loading = true
    this.profileService.setPassword(this.newPassword, this.password).subscribe(
      data => {
        this.flashMessagesService.show('Password updated successfully!', {
          cssClass: 'ui success message'
        })
        this.loading = false
        this.refresh()
      },
      err => this.errorHandler(err)
    )
  }

}
