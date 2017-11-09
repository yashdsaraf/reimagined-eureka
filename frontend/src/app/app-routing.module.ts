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

import {NgModule} from '@angular/core'
import {
  RouterModule,
  Routes
} from '@angular/router'

import {AboutUsComponent} from './components/about-us/about-us.component'
import {IndexComponent} from './components/index/index.component'
import {LoginComponent} from './components/login/login.component'
import {RegisterComponent} from './components/register/register.component'

const routes: Routes = [
  {path: '', redirectTo: '/index', pathMatch: 'full'},
  {path: 'index', component: IndexComponent},
  {path: 'aboutus', component: AboutUsComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
