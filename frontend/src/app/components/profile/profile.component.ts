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

import {Component, ViewChild, ElementRef, OnInit} from '@angular/core'
import {User} from '../../models/user'
import {isMobile} from '../../app.component'
import {NgForm} from '@angular/forms'

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
    username: '',
    password: ''
  }
  confirmPassword = ''
  isHidden = true
  useEmailAsPass = false
  error = ''
  loading = false
  @ViewChild('passwordField') passwordField: ElementRef

  constructor() {
    this.isMobile = isMobile
    this.editable = false
    this.passModal = false
  }

  openModal(){
    this.passModal = true
  }

  closeModal(){
    this.passModal = false
  }

  onPasswordChange() {
    this.isHidden = !this.isHidden
    let element = this.passwordField.nativeElement
    element.type = this.isHidden ? 'password' : 'text'
    element.focus()
  }

  getIdenticonObject() {
    let obj = {
      value: this.user.name,
      size: 150
    }
    return JSON.stringify(obj)
  }

}
