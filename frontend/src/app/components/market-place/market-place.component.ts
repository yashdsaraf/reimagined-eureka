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
  Input,
  OnInit,
  Output
} from '@angular/core'
import {ActivatedRoute, Router} from '@angular/router'

import {CoreService} from '../../services/core.service'
import {FlashMessagesService} from 'angular2-flash-messages'
import {IndexService} from '../../services/index.service'
import {ProgressBarService} from '../../services/progress-bar.service'
import {Plugin} from '../../models/plugin'
import {PluginsService} from '../../services/plugins.service'
import {isMobile} from '../../app.component'
import {decodeError} from '../../utils/general-utils'

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.sass'],
})
export class MarketPlaceComponent implements OnInit {

  isMobile: boolean
  plugins: Plugin[] = []
  _search: string
  isProjectOpen: boolean
  projectDetails = {
    plugin: '',
    project: '',
    entrypoint: ''
  }
  createProjectModal: boolean
  @Input('isImport') isImport: boolean
  @Output('importDetails') importDetails = new EventEmitter<string[]>()

  constructor(
    private route: ActivatedRoute,
    private coreService: CoreService,
    private flashMessagesService: FlashMessagesService,
    private indexService: IndexService,
    private pluginsService: PluginsService,
    private progressBarService: ProgressBarService,
    private router: Router
  ) {
    this.isMobile = isMobile
    coreService.check().subscribe(
      data => this.isProjectOpen = true,
      err => this.isProjectOpen = false
    )
    let plugin = this.route.snapshot.params.plugin
    if (plugin !== undefined && plugin !== null) {
      this.projectDetails.plugin = plugin
      this.createProjectModal = true
    }
  }

  ngOnInit() {
    this.getPlugins()
  }

  getIdenticonObject(value: string, size: number) {
    let obj = {value, size}
    return JSON.stringify(obj)
  }

  getPlugins(value?: string) {
    this.pluginsService.getPlugins(value).
      subscribe(
        data => this.plugins = data
      )
  }

  onClick(name: string) {
    if (this.isProjectOpen) {
      this.installPlugin(name)
      return
    }
    this.projectDetails.plugin = name
    // Reset project details
    this.projectDetails.project = ''
    this.projectDetails.entrypoint = ''
    this.createProjectModal = true
  }

  installPlugin(name: string) {
    this.progressBarService.show(null, "Installing plugin")
    this.pluginsService.installPlugin(name)
      .subscribe(data => {
        this.progressBarService.dismiss()
        this.flashMessagesService.show('Plugin installed to current project!', {
          cssClass: 'ui success message', timeout: 4000
        })
        this.getPlugins(this.search)
      }, err => {
        this.progressBarService.dismiss()
        this.flashMessagesService.show(decodeError(err), {
          cssClass: 'ui error message', timeout: 4000
        })
      })
  }

  createProject() {
    this.createProjectModal = false
    if (this.isImport) {
      let _importDetails = [this.projectDetails.entrypoint, this.projectDetails.plugin, this.projectDetails.project]
      this.importDetails.emit(_importDetails)
      return
    }
    this.progressBarService.show(null, "Creating project")
    this.coreService.create(
      this.projectDetails.plugin,
      this.projectDetails.project,
      this.projectDetails.entrypoint
    ).subscribe(
      data => {
        this.indexService.clearAll()
        this.router.navigate(['/index', {mode: data}])
        this.progressBarService.dismiss()
      },
      err => {
        this.progressBarService.dismiss()
        let message = decodeError(err)
        if (message == '' || message == null || message == undefined) {
          message = 'An internal error occured'
        }
        this.flashMessagesService.show(message, {
          cssClass: 'ui error message', timeout: 4000
        })
      }
    )
  }

  set search(value: string) {
    this._search = value
    this.getPlugins(value)
  }

  get search(): string {
    return this._search
  }

  isProjectDetailsEmpty() {
    return this.projectDetails.project == '' || this.projectDetails.project == null || this.projectDetails.entrypoint == '' || this.projectDetails.entrypoint == null
  }

}
