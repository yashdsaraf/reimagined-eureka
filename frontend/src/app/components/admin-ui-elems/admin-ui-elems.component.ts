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

import {ContactsService} from '../../services/contacts.service'
import {ImagesService} from '../../services/images.service'
import {isMobile} from '../../app.component'

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
  isEdit: string
  environments: Object
  envKeys = []
  svg: string
  email:string = ''
  phone:string = ''

  constructor(
    private flashMessagesService: FlashMessagesService,
    private contactsService: ContactsService,
    private imagesService: ImagesService
  ) {
    this.isMobile = isMobile
    this.updateBgImage()
    this.updatePlugins()
    this.updateContacts()
  }

  ngAfterViewInit() {
    setTimeout(() => this.heading.emit('UI Elements'))
  }

  onImageChange(event) {
    let file = event.target.files[0]
    this.image = file
    this.uploadButton = true
  }

  onSvgChange(event) {
    let file = event.target.files[0]
    let reader = new FileReader()
    reader.addEventListener("load", () => {
      this.svg = reader.result
    }, false)

    if (file) {
      reader.readAsText(file, 'UTF-8')
    }
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

  updateContacts() {
    this.contactsService.getContacts().
    subscribe((data: any) => {
      this.email = data.email
      this.phone = data.phone
    })
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

  onContactsSubmit() {
    this.contactsService.setContacts(this.email, this.phone)
      .subscribe(
        data => {
          this.flashMessagesService.show('Contact details have been updated!',
            {cssClass: 'ui success message', timeout: 4000})
          this.updateContacts()
        },
        err => this.flashMessagesService.show('Contact details could not be updated',
        {cssClass: 'ui error message', timeout: 4000})
      )
  }

  dataUri(env: string) {
    let uri = `<img src='data:image/svg+xml;utf8,${encodeURIComponent(this.environments[env])}' />`
    return uri
  }

  setPlugin(env: string, name: string) {
    this.imagesService.setPlugin(env, name, this.svg)
      .subscribe(
        data => {
          this.flashMessagesService.show('Plugin updated!',
            {cssClass: 'ui success message', timeout: 4000})
          this.isEdit = ''
          this.svg = ''
          this.updatePlugins()
        },
        err => this.flashMessagesService.show('Plugin could not be updated',
        {cssClass: 'ui error message', timeout: 4000})
      )
  }

}
