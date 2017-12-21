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
  ViewChild
} from '@angular/core'
import {NgForm} from '@angular/forms'

import {FlashMessagesService} from 'angular2-flash-messages'

import {isMobile} from '../../app.component'
import {LoginService} from '../../services/login.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {

  isMobile: boolean
  username = ''
  password = ''
  remember_me = true
  isHidden = true
  error = ''
  loading = false
  guestLoading = false
  forgotPassword = false
  isEmailValid = true
  forgotPasswordEmail = ''
  otpPrompt = false
  otp = ''
  newPassword = ''
  cNewPassword = ''
  @ViewChild('passwordField') passwordField

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

  onForgotPasswordEmail() {
    this.loginService.forgotPasswordEmail(this.forgotPasswordEmail)
      .then(() => {
        this.otpPrompt = true
      })
      .catch(err => {
        this.error = err
      })
  }

  onForgotPasswordOtp() {
    this.loginService.forgotPasswordOtp(this.forgotPasswordEmail, this.otp, this.newPassword)
      .then(() => {
        this.flashMessagesService.show('Password updated successfully!', {
          cssClass: 'ui success message', timeout: 4000
        })
      })
      .catch(err => {
        this.error = err
      })
  }

  isForgotPasswordEmailValid() {
    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g.test(this.forgotPasswordEmail)
  }

  isForgotPasswordOtpNotValid() {
    return this.otp == null || this.newPassword == null || this.otp.length < 4 || this.newPassword.length < 8 || this.newPassword != this.cNewPassword
  }

  loginAsGuest() {
    this.guestLoading = true
    this.loginService.loginAsGuest()
      .then(() => this.guestLoading = false)
      .catch(err => {
        this.error = this.getMessageFromError(err)
        this.guestLoading = false
      })
    }

  onSubmit(f: NgForm) {
    if (f.valid) {
      this.loading = true
      this.loginService.login(this.username, this.password, this.remember_me)
        .then(() => this.loading = false)
        .catch(err => {
          this.error = this.getMessageFromError(err)
          this.loading = false
        })
    }
  }

  private getMessageFromError(err: any): string {
    let message: string
    try {
      let json = JSON.parse(err)
      message = json.error_description
    } catch(e) {
      message = err
    }
    return message
  }
  
}
