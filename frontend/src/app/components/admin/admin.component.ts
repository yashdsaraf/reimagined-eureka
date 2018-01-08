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
  ComponentFactoryResolver,
  ViewChild,
  ViewContainerRef
} from '@angular/core'

import {AdminDashComponent} from '../admin-dash/admin-dash.component'
import {AdminPluginsComponent} from '../admin-plugins/admin-plugins.component'
import {AdminUiElemsComponent} from '../admin-ui-elems/admin-ui-elems.component'
import {AdminUsersComponent} from '../admin-users/admin-users.component'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent {

  @ViewChild('parent', {read: ViewContainerRef}) container: ViewContainerRef
  @ViewChild('sidebar') sidebar

  isOpen: string

  constructor(private _cfr: ComponentFactoryResolver) { }

  ngAfterViewInit() {
    this.loadComponent(AdminDashComponent)
    this.isOpen = 'dash'
  }

  users() {
    this.addComponent(AdminUsersComponent)
    this.isOpen = 'users'
  }

  plugins() {
    this.addComponent(AdminPluginsComponent)
    this.isOpen = 'plugins'
  }

  dash() {
    this.addComponent(AdminDashComponent)
    this.isOpen = 'dash'
  }

  uiElems() {
    this.addComponent(AdminUiElemsComponent)
    this.isOpen = 'ui'
  }

  addComponent(component) {
    this.sidebar.close()
    this.loadComponent(component)
  }

  loadComponent(component) {
    let comp = this._cfr.resolveComponentFactory(component)
    this.container.clear()
    let created = this.container.createComponent(comp)
  }

}
