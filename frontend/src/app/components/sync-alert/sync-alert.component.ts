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

import {Component, OnDestroy} from '@angular/core'
import {Subscription} from 'rxjs'

import {SyncAlertService, SyncAlertStatus} from '../../services/sync-alert.service'
import {isMobile} from '../../app.component'

@Component({
  selector: 'app-sync-alert',
  templateUrl: './sync-alert.component.html',
  styleUrls: ['./sync-alert.component.sass']
})
export class SyncAlertComponent implements OnDestroy {

  status: SyncAlertStatus
  subscription: Subscription
  // Workaround to access the enum in the template
  SyncAlertStatus = SyncAlertStatus
  isMobile = isMobile

  constructor(private syncAlertService: SyncAlertService) {
    this.status = SyncAlertStatus.DISMISSED
    this.subscription = syncAlertService.emitter
    .subscribe(status => this.status = status)
  }

  ngOnDestroy() {
    this.subscription.unsubscribe()
  }

}
