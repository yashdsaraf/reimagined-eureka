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
  ViewContainerRef,
  OnInit
} from '@angular/core'

import {AdminDashComponent} from '../admin-dash/admin-dash.component'
import {AdminPluginsComponent} from '../admin-plugins/admin-plugins.component'
import {AdminUiElemsComponent} from '../admin-ui-elems/admin-ui-elems.component'
import {AdminUsersComponent} from '../admin-users/admin-users.component'
import {isMobile} from '../../app.component'

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.sass']
})
export class AdminComponent implements OnInit {

  @ViewChild('parent', {read: ViewContainerRef}) container: ViewContainerRef
  @ViewChild('sidebar') sidebar

  heading: string
  isMobile: boolean

  constructor(private _cfr: ComponentFactoryResolver) {
    this.isMobile = isMobile
  }

  ngOnInit() {
    this.loadComponent(AdminDashComponent)
  }

  users() {
    this.addComponent(AdminUsersComponent)
  }

  plugins() {
    this.addComponent(AdminPluginsComponent)
  }

  dash() {
    this.addComponent(AdminDashComponent)
  }

  uiElems() {
    this.addComponent(AdminUiElemsComponent)
  }

  addComponent(component) {
    this.sidebar.close()
    this.loadComponent(component)
  }

  loadComponent(component) {
    let comp = this._cfr.resolveComponentFactory(component)
    this.container.clear()
    let created = this.container.createComponent(comp)
    this.heading = component.heading
  }

}
