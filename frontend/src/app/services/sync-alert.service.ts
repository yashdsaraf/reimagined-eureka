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
import {Subject} from 'rxjs/Subject'
import {Observable} from 'rxjs/Observable'

export enum SyncAlertStatus {
  DISMISSED,
  FORCE_CLOSE,
  SYNCING,
  SUCCESS,
  ERROR
}

@Injectable()
export class SyncAlertService {

  private subject: Subject<SyncAlertStatus> = new Subject()
  emitter: Observable<SyncAlertStatus> = this.subject.asObservable()
  currentStatus: SyncAlertStatus

  constructor() {}

  show() {
    this.status = SyncAlertStatus.SYNCING
  }

  dismiss() {
    this.status = SyncAlertStatus.DISMISSED
  }

  forceClose() {
    this.status = SyncAlertStatus.FORCE_CLOSE
  }

  success() {
    if (this.status === SyncAlertStatus.FORCE_CLOSE) {
      return
    }
    this.status = SyncAlertStatus.SUCCESS
    this.dismissAfter(3000)
  }

  error() {
    if (this.status === SyncAlertStatus.FORCE_CLOSE) {
      return
    }
    this.status = SyncAlertStatus.ERROR
    this.dismissAfter(3000)
  }

  dismissAfter(ms: number) {
    setTimeout(() => this.dismiss(), ms)
  }

  set status(value: SyncAlertStatus) {
    this.currentStatus = value
    this.subject.next(value)
  }

  get status(): SyncAlertStatus {
    return this.currentStatus
  }

}
