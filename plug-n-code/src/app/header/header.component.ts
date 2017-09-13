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

import {Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @ViewChild('header') header;
  isHeaderOpen: boolean = false;

  openHeader(): void {
    this.header.nativeElement.style.display = "flex";
    this.isHeaderOpen = true;
  }

  closeHeader(): void {
    this.header.nativeElement.style.display = "none"
    this.isHeaderOpen = false;
  }

  toggleHeader(): void {
    if (this.isHeaderOpen) {
      this.closeHeader();
    } else {
      this.openHeader();
    }
  }

}
