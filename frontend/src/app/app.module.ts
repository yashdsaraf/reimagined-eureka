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
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {BrowserModule} from '@angular/platform-browser'
import {HttpClientModule} from '@angular/common/http'

import {CodemirrorModule} from 'ng2-codemirror'
import {JwtModule} from '@auth0/angular-jwt'
import {SuiModule} from 'ng2-semantic-ui'

import {AppComponent} from './app.component'
import {AppRoutingModule} from './app-routing.module'
import {AboutUsComponent} from './components/about-us/about-us.component'
import {FileExComponent} from './components/file-ex/file-ex.component'
import {HeaderComponent} from './components/header/header.component'
import {IndexComponent} from './components/index/index.component'
import {LoginComponent} from './components/login/login.component'
import {OutputComponent} from './components/output/output.component'
import {RegisterComponent} from './components/register/register.component'
import {ToolbarComponent} from './components/toolbar/toolbar.component'

@NgModule({
  declarations: [
    AppComponent,
    AboutUsComponent,
    FileExComponent,
    HeaderComponent,
    IndexComponent,
    LoginComponent,
    OutputComponent,
    RegisterComponent,
    ToolbarComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserAnimationsModule,
    BrowserModule,
    CodemirrorModule,
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: () => {
          return localStorage.getItem('access_token')
        },
        whitelistedDomains: ['localhost:8181']
      }
    }),
    SuiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
