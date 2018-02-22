/*
 * Copyright 2018 Yash D. Saraf, Raees R. Mulla and Sachin S. Negi.
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
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'

import {FlashMessagesService} from 'angular2-flash-messages'

import {CoreService} from '../services/core.service'

@Injectable()
export class ProjectGuard implements CanActivate {

  constructor(
    private coreService: CoreService,
    private flashMessagesService: FlashMessagesService,
    private router: Router
  ) {

  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
    let inverse = next.data["inverse"] as boolean
    inverse = !!inverse
    return new Promise<boolean>((resolve, reject) => {
      this.coreService.check().subscribe(
        data => {
          if (inverse) {
            this.router.navigate(["/home"])
            this.flashMessagesService.show('A project already exists in the session!', {
              cssClass: 'ui error message', timeout: 4000
            })
          }
          resolve(!inverse)
        },
        err => {
          if (!inverse) {
            this.router.navigate(["/createproject"])
          }
          resolve(inverse)
        }
      )
    })
  }
}
