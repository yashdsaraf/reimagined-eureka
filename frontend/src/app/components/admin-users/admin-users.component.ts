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
  EventEmitter,
  Input,
  Output
} from '@angular/core'
import {isMobile} from '../../app.component'
import {User} from '../../models/user'
import {AdminService} from '../../services/admin.service'
import {decodeError} from '../../utils/general-utils'

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrls: ['./admin-users.component.sass']
})
export class AdminUsersComponent {

  @Output('heading') heading = new EventEmitter()
  isMobile: boolean
  users: User[]
  deleteUsername = ''
  userDeleted = false
  userDeleteError = ''
  _search: string

  constructor(private adminService: AdminService) {
    this.isMobile = isMobile
  }

  ngAfterViewInit() {
    setTimeout(() => this.heading.emit('Users'))
    this.getUsers()
  }

  getUsers(value?: string) {
    this.adminService.getUsers(value).
      subscribe(
        data => this.users = data
      )
  }

  deleteUser(username: string) {
    this.adminService.deleteUser(username).
      subscribe(
        data => {
          this.userDeleted = true
          this.getUsers(this.search)
        },
        err => {
          this.userDeleted = false
          this.userDeleteError = decodeError(err)
        }
      )
    this.deleteUsername = ''
  }

  @Input('search')
  set search(value: string) {
    this._search = value
    this.getUsers(value)
  }

  get search(): string {
    return this._search
  }

}
