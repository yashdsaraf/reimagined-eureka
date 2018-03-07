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

import {Component} from '@angular/core'
import {Router} from '@angular/router'

import {FlashMessagesService} from 'angular2-flash-messages'
import {SuiModalService} from 'ng2-semantic-ui'

import {AuthService} from '../../services/auth.service'
import {ContactsService} from '../../services/contacts.service'
import {CoreService} from '../../services/core.service'
import {ImagesService} from '../../services/images.service'
import {isMobile} from '../../app.component'
import {KLOUDLESS_APP_ID} from '../../utils/application'
import {decodeError} from '../../utils/general-utils'
import {VideoModal} from '../video-modal/video-modal.component'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  isMobile: boolean

  info = {
    'Plugin support': `<ul>
    <li>
      In
      <span class="logo">Plug n’ Code</span>, any user, after going through a minimal authentication process, can create and publish a
      plugin in the marketplace to add support for a specific language. This enables the users to go beyond the pre-defined
      capabilities of the application.
    </li>
    <li>
      Each plugin goes through a thorough screening process to ensure no harmful or ill-intended code goes into the system. It
      goes through automated tests to test the structure of the plugin, it is then tested by the admins to test the
      functionality provided by the plugin.
    </li>
  </ul>`,
    'Complex execution environments': `<ul>
    <li>
      In
      <span class="logo">Plug n’ Code</span> the goal is to provide pre-defined environments as well as the option to tailor the execution
      environment specific to the project’s needs.
    </li>
  </ul>`,
    'Secure execution of code': `<ul>
    <li>
      Each build of a project in
      <span class="logo">Plug n’ Code</span> runs on a separate isolated docker instance to make sure no system specific issues interfere
      with the job.
    </li>
    <li>
      This ensures safety of the project data and all kinds of output or logs are directly forwarded to the user’s browser window
      without being persisted in any kind of data storage medium.
    </li>
  </ul>`
  }
  headers = Object.keys(this.info)
  environments: Object
  envKeys = []
  image: any
  contacts: Object = {
    email: '',
    phone: ''
  }
  explorer: any
  openProjectModal: boolean
  offlineOpenModal: boolean
  importMarketPlaceModal: boolean
  currentOperation: string = 'open'
  openFile: File
  openLink: string
  _importDetails: string[] = []

  constructor(
    private authService: AuthService,
    private contactsService: ContactsService,
    private coreService: CoreService,
    private flashMessagesService: FlashMessagesService,
    private imagesService: ImagesService,
    private router: Router,
    private suiModalService: SuiModalService
  ) {
    this.isMobile = isMobile
    this.imagesService.getImage('home').subscribe(
      data => {
        this.createImageFromBlob(data)
      }
    )
    this.imagesService.getPlugins().subscribe(
      data => {
        this.environments = data
        this.envKeys = Object.keys(data)
      }
    )
    this.contactsService.getContacts().
      subscribe((data: Object) => this.contacts = data)
    this.openProjectModal = false
    this.offlineOpenModal = false
  }

  ngAfterViewInit() {
    let _window: any = window
    this.explorer = _window.Kloudless.explorer({
      app_id: KLOUDLESS_APP_ID,
      computer: true,
      persist: 'session'
    })
  }

  openOnlineProject() {
    if (this.isNotLoggedIn() || this.authService.getRole() == 'GUEST') {
      this.router.navigate(['/login'])
      return
    }
    this.openProjectModal = false
    this.explorer.choose({
      types: ['tgz', 'tar.gz']
    })
    this.explorer.on('success', files => {
      if (this.currentOperation == 'import') {
        this.importMarketPlaceModal = true
        this.currentOperation = 'importOnline'
        this.openLink = files[0].link
        return
      }
      this.coreService.openFromLink(files[0].link).subscribe(
        data => this.router.navigate(['/index', {mode: data}]),
        err => {
          this.errorHandler(err)
        }
      )
    })
  }

  openOfflineModal() {
    this.openProjectModal = false
    this.openFile = null
    this.offlineOpenModal = true
  }

  openOfflineProject() {
    if (this.isNotLoggedIn()) {
      this.router.navigate(['/login'])
      return
    }
    this.offlineOpenModal = false
    if (this.currentOperation == 'import') {
      this.importMarketPlaceModal = true
      this.currentOperation = 'importOffline'
      return
    }
    this.coreService.openFromFile(this.openFile).subscribe(
      data => this.router.navigate(['/index', {mode: data}]),
      err => {
        this.errorHandler(err)
      }
    )
  }

  importProject() {
    if (this.isNotLoggedIn()) {
      this.router.navigate(['/login'])
      return
    }
    let [entrypoint, plugin, project] = this.importDetails
    switch (this.currentOperation) {
      case 'importOffline':
        this.coreService.importFromFile(this.openFile, plugin, project, entrypoint).subscribe(
          data => this.router.navigate(['/index', {mode: data}]),
          err => {
            this.errorHandler(err)
          }
        )
        break
      case 'importOnline':
        if (this.authService.getRole() == 'GUEST') {
          this.router.navigate(['/login'])
          return
        }
        this.coreService.importFromLink(this.openLink, plugin, project, entrypoint).subscribe(
          data => this.router.navigate(['/index', {mode: data}]),
          err => {
            this.errorHandler(err)
          }
        )
        break
    }
  }

  isProjectInSession(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.coreService.check().subscribe(
        data => {
          this.flashMessagesService.show('A project already exists in the session!', {
            cssClass: 'ui error message', timeout: 4000
          })
          reject()
        },
        err => {
          resolve()
        }
      )
    })
  }

  onFileChange(event: any) {
    this.openFile = event.target.files[0]
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.isNotLoggedIn()) {
        this.suiModalService.open(new VideoModal('https://www.youtube.com/embed/Skk-fNV-D5M?rel=0'))
      }
    })
  }

  createImageFromBlob(image: Blob) {
    let reader = new FileReader()
    reader.addEventListener("load", () => {
      this.image = `url(${reader.result})`
    }, false)

    if (image) {
      reader.readAsDataURL(image)
    }
  }

  showOpenProjectModal(operation: string) {
    if (this.isNotLoggedIn()) {
      this.router.navigate(['/login'])
      return
    }
    this.isProjectInSession().then(() => {
      this.currentOperation = operation
      if (this.authService.getRole() == 'GUEST') {
        this.openOfflineModal()
        return
      }
      this.openProjectModal = true
    }).catch(() => {})
  }

  isNotLoggedIn(): boolean {
    return this.authService.getRole() == null
  }

  dataUri(env: string) {
    let uri = `<img src='data:image/svg+xml;utf8,${encodeURIComponent(this.environments[env])}' />`
    return uri
  }

  errorHandler(err) {
    this.flashMessagesService.show(decodeError(err), {
      cssClass: 'ui error message', timeout: 4000
    })
  }

  get importDetails(): string[] {
    return this._importDetails
  }

  set importDetails(value: string[]) {
    this._importDetails = value
    this.importMarketPlaceModal = false
    this.importProject()
  }

}
