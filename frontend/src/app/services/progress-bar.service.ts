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

import {Injectable} from '@angular/core'

import {
  ModalSize,
  SuiModalService
} from 'ng2-semantic-ui'
import {SuiComponentFactory} from 'ng2-semantic-ui/dist/misc/util/index'

import {ProgressBarModal} from '../components/progress-bar-modal/progress-bar-modal.component'

declare const $: any

@Injectable()
export class ProgressBarService extends SuiModalService {

  defaultTitle = 'Please wait...'
  defaultContent = 'Loading'

  constructor(_suiComponentFactory: SuiComponentFactory) {
    super(_suiComponentFactory)
  }

  show(title: string, content: string, modalSize = ModalSize.Small) {
    title = title == null ? this.defaultTitle : title
    content = content == null ? this.defaultContent : content
    super.open(new ProgressBarModal(title, content, modalSize))
  }

  dismiss() {
    $('sui-modal').remove()
  }

}
