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
  image: any
  uploaded = false

  constructor(private imagesService: ImagesService) {
    this.isMobile = isMobile
  }

  ngAfterViewInit() {
    setTimeout(() => this.heading.emit('UI Elements'))
  }

  onImageChange(files: any) {
    let file = files[0].srcElement
    this.image = file
    // let reader = new FileReader()
    // if(event.srcElement.files && event.srcElement.files.length > 0) {
    //   let file = event.srcElement.files[0]
    //   reader.readAsDataURL(file)
    //   reader.onload = () => {
    //     this.image = reader.result.split(',')[1]
    this.uploaded = true
    //   }
    // }
  }

  onImageSubmit() {
    if (this.image != null && this.image != undefined) {
      this.imagesService.setHomeImage(this.image)
        .subscribe(data => console.log('done'))
      this.image = null
      this.uploaded = false
    }
  }

}
