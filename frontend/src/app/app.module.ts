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
  APP_INITIALIZER,
  NgModule
} from '@angular/core'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {BrowserModule} from '@angular/platform-browser'
import {FormsModule} from '@angular/forms'
import {
  HTTP_INTERCEPTORS,
  HttpClientModule
} from '@angular/common/http'
import {HttpModule} from '@angular/http'

import {CodemirrorModule} from 'ng2-codemirror'
import {FlashMessagesModule} from 'angular2-flash-messages'
import {SuiModule} from 'ng2-semantic-ui'

//COMPONENTS
import {AboutUsComponent} from './components/about-us/about-us.component'
import {AdminBlogComponent} from './components/admin-blog/admin-blog.component'
import {AdminComponent} from './components/admin/admin.component'
import {AdminDashComponent} from './components/admin-dash/admin-dash.component'
import {AdminPluginsComponent} from './components/admin-plugins/admin-plugins.component'
import {AdminUiElemsComponent} from './components/admin-ui-elems/admin-ui-elems.component'
import {AdminUsersComponent} from './components/admin-users/admin-users.component'
import {AppComponent} from './app.component'
import {AppRoutingModule} from './app-routing.module'
import {BlogComponent} from './components/blog/blog.component'
import {CreateProjectComponent} from './components/create-project/create-project.component'
import {DocsComponent} from './components/docs/docs.component'
import {FileExComponent} from './components/file-ex/file-ex.component'
import {HeaderComponent} from './components/header/header.component'
import {HomeComponent} from './components/home/home.component'
import {IndexComponent} from './components/index/index.component'
import {LoginComponent} from './components/login/login.component'
import {LogoutComponent} from './components/logout/logout.component'
import {MarketPlaceComponent} from './components/market-place/market-place.component'
import {OutputComponent} from './components/output/output.component'
import {ProfileComponent} from './components/profile/profile.component'
import {ProgressBarModalComponent} from './components/progress-bar-modal/progress-bar-modal.component'
import {ProjectSettingsComponent} from './components/project-settings/project-settings.component'
import {RegisterComponent} from './components/register/register.component'
import {ToolbarComponent} from './components/toolbar/toolbar.component'
//SERVICES
import {AdminService} from './services/admin.service'
import {AuthService} from './services/auth.service'
import {ContactsService} from './services/contacts.service'
import {CookieService} from './services/cookie.service'
import {CoreService} from './services/core.service'
import {DisplayNameService} from './services/display-name.service'
import {EditorConfigService} from './services/editor-config.service'
import {FileExService} from './services/file-ex.service'
import {ImagesService} from './services/images.service'
import {IndexService} from './services/index.service'
import {LoginService} from './services/login.service'
import {LogoutService} from './services/logout.service'
import {PluginsService} from './services/plugins.service'
import {ProgressBarService} from './services/progress-bar.service'
import {ProjectSettingsService} from './services/project-settings.service'
import {StartupService} from './services/startup.service'
//INTERCEPTORS
import {OAuthInterceptor} from './interceptors/oauth.interceptor'
//GUARDS
import {AdminGuard} from './guards/admin.guard'
import {DeveloperGuard} from './guards/developer.guard'
import {GuestGuard} from './guards/guest.guard'
import {ProjectGuard} from './guards/project.guard'
import {UserGuard} from './guards/user.guard'
//DIRECTIVES
import {IdenticonDirective} from './directives/identicon.directive'
//PIPES
import {InitCapPipe} from './pipes/init-cap.pipe'
import {SanitizeHtmlPipe} from './pipes/sanitizer.pipe'

export function init(startupService: StartupService) {
  return () => startupService.init()
}

@NgModule({
  declarations: [
    AboutUsComponent,
    AdminBlogComponent,
    AdminComponent,
    AdminDashComponent,
    AdminPluginsComponent,
    AdminUiElemsComponent,
    AdminUsersComponent,
    AppComponent,
    BlogComponent,
    CreateProjectComponent,
    DocsComponent,
    FileExComponent,
    HeaderComponent,
    HomeComponent,
    IndexComponent,
    LoginComponent,
    LogoutComponent,
    OutputComponent,
    MarketPlaceComponent,
    ProfileComponent,
    ProgressBarModalComponent,
    ProjectSettingsComponent,
    RegisterComponent,
    ToolbarComponent,
    IdenticonDirective,
    InitCapPipe,
    SanitizeHtmlPipe
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CodemirrorModule,
    FlashMessagesModule,
    FormsModule,
    HttpClientModule,
    HttpModule,
    SuiModule
  ],
  providers: [
    {provide: APP_INITIALIZER, useFactory: init, deps: [StartupService], multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: OAuthInterceptor, multi: true},
    AuthService,
    AdminService,
    ContactsService,
    CookieService,
    CoreService,
    DisplayNameService,
    EditorConfigService,
    FileExService,
    ImagesService,
    IndexService,
    LoginService,
    LogoutService,
    PluginsService,
    ProgressBarService,
    ProjectSettingsService,
    StartupService,
    AdminGuard,
    DeveloperGuard,
    GuestGuard,
    ProjectGuard,
    UserGuard
  ],
  entryComponents: [ProgressBarModalComponent],
  bootstrap: [AppComponent]
})
export class AppModule {}
