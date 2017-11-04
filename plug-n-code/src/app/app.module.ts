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

import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule} from '@angular/platform-browser/animations'
import {NgModule} from '@angular/core'

import {CodemirrorModule} from 'ng2-codemirror'
import {SuiModule} from 'ng2-semantic-ui'

import {AppComponent} from './app.component'
import {AppRoutingModule} from './app-routing.module'
import {FileExComponent} from './components/file-ex/file-ex.component'
import {HeaderComponent} from './components/header/header.component'
import {IndexComponent} from './components/index/index.component'
import {OutputComponent} from './components/output/output.component'
import {ToolbarComponent} from './components/toolbar/toolbar.component'

@NgModule({
  declarations: [
    AppComponent,
    FileExComponent,
    HeaderComponent,
    IndexComponent,
    OutputComponent,
    ToolbarComponent
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    BrowserAnimationsModule,
    CodemirrorModule,
    SuiModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
