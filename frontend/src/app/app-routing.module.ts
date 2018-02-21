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

//COMPONENTS
import {AboutUsComponent} from './components/about-us/about-us.component'
import {AdminComponent} from './components/admin/admin.component'
import {BlogComponent} from './components/blog/blog.component'
import {DocsComponent} from './components/docs/docs.component'
import {HomeComponent} from './components/home/home.component'
import {IndexComponent} from './components/index/index.component'
import {LoginComponent} from './components/login/login.component'
import {LogoutComponent} from './components/logout/logout.component'
import {ProfileComponent} from './components/profile/profile.component'
import {RegisterComponent} from './components/register/register.component'
import {MarketPlaceComponent} from './components/market-place/market-place.component'

//GUARDS
import {AdminGuard} from './guards/admin.guard'
import {DeveloperGuard} from './guards/developer.guard'
import {GuestGuard} from './guards/guest.guard'
import {ProjectGuard} from './guards/project.guard'
import {UserGuard} from './guards/user.guard'

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'aboutus', component: AboutUsComponent},
  {path: 'admin', component: AdminComponent, canActivate: [AdminGuard]},
  {path: 'blog', component: BlogComponent},
  {path: 'createproject', component: MarketPlaceComponent, canActivate: [GuestGuard, ProjectGuard], data: {inverse: true}},
  {path: 'docs', component: DocsComponent},
  {path: 'home', component: HomeComponent},
  {path: 'index', component: IndexComponent, canActivate: [GuestGuard, ProjectGuard]},
  {path: 'index/:openfile/:mode', component: IndexComponent, canActivate: [GuestGuard, ProjectGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'logout/:message', component: LogoutComponent},
  {path: 'logout/:message/:error', component: LogoutComponent},
  {path: 'logout', component: LogoutComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [GuestGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'marketplace', component: MarketPlaceComponent, canActivate: [GuestGuard]}

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
