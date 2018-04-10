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
  ViewChild
} from '@angular/core'
import {NgForm} from '@angular/forms'

import {FlashMessagesService} from 'angular2-flash-messages/module/flash-messages.service'

import {isMobile} from '../../app.component'
import {LoginService} from '../../services/login.service'
import {User} from '../../models/user'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.sass']
})
export class RegisterComponent {

  isMobile: boolean
  user: User = {
    name: '',
    email: '',
    username: '',
    password: ''
  }
  confirmPassword = ''
  remember_me = true
  isHidden = true
  useEmailAsPass = false
  error = ''
  loading = false
  @ViewChild('passwordField') passwordField: ElementRef

  constructor(
    private flashMessagesService: FlashMessagesService,
    private loginService: LoginService
  ) {
    this.isMobile = isMobile
  }

  onPasswordChange() {
    this.isHidden = !this.isHidden
    let element = this.passwordField.nativeElement
    element.type = this.isHidden ? 'password' : 'text'
    element.focus()
  }

  onUsernameChange() {
    this.user.username = this.useEmailAsPass ? '' : this.user.email
    this.useEmailAsPass = !this.useEmailAsPass
  }

  onEmailChange() {
    if (this.useEmailAsPass) {
      this.user.username = this.user.email
    }
  }

  onSubmit(f: NgForm) {
    let onReject = err => {
      this.error = err
      this.loading = false
    }

    if (f.valid && this.user.password == this.confirmPassword) {
      this.loading = true
      this.loginService.register(this.user, this.remember_me)
        .then(() => {
          this.loginService.login(this.user.username, this.user.password, this.remember_me)
            .catch(onReject)
        }).catch(onReject)
    }
  }
}
