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
  Output
} from '@angular/core'

import {FlashMessagesService} from 'angular2-flash-messages'

import {isMobile} from '../../app.component'
import {ImagesService} from '../../services/images.service'

@Component({
  selector: 'app-admin-ui',
  templateUrl: './admin-ui-elems.component.html',
  styleUrls: ['./admin-ui-elems.component.sass']
})
export class AdminUiElemsComponent {

  @Output('heading') heading = new EventEmitter()
  isMobile: boolean
  image: File
  uploadButton = false
  bgImage: any
  environments: Object
  envKeys = []

  constructor(
    private flashMessagesService: FlashMessagesService,
    private imagesService: ImagesService
  ) {
    this.isMobile = isMobile
    this.updateBgImage()
    // this.updatePlugins()
  }

  ngAfterViewInit() {
    setTimeout(() => this.heading.emit('UI Elements'))
  }

  onImageChange(event) {
    let file = event.target.files[0]
    this.image = file
    this.uploadButton = true
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader()
    reader.addEventListener("load", () => {
       this.bgImage = reader.result
    }, false)

    if (image) {
       reader.readAsDataURL(image)
    }
  }

  updateBgImage() {
    this.imagesService.getImage('home').subscribe(
      data => {
        this.createImageFromBlob(data)
      }
    )
  }

  updatePlugins() {
    this.imagesService.getPlugins().subscribe(
      data => {
        this.environments = data
        this.envKeys = Object.keys(data)
      }
    )
  }

  onImageSubmit() {
    if (this.image != null && this.image != undefined) {
      this.imagesService.setHomeImage(this.image)
        .subscribe(
          data => {
            this.flashMessagesService.show('Home background image has been updated!',
              {cssClass: 'ui success message', timeout: 4000})
            this.image = null
            this.uploadButton = false
            this.updateBgImage()
          },
          err => this.flashMessagesService.show('Home background image could not be updated',
          {cssClass: 'ui error message', timeout: 4000})
        )
    }
  }

}
