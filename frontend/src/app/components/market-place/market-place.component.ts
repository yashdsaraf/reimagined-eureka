import { Component, OnInit } from '@angular/core';

import {ContactsService} from '../../services/contacts.service'
import {ProgressBarService} from '../../services/progress-bar.service';
import {isMobile} from '../../app.component'
import {Plugin} from '../../models/plugin'
import {PluginsService} from '../../services/plugins.service';

@Component({
  selector: 'app-market-place',
  templateUrl: './market-place.component.html',
  styleUrls: ['./market-place.component.sass'],
})
export class MarketPlaceComponent implements OnInit {

  contacts: Object = {
    email: '',
    phone: ''
  }
  isMobile: boolean
  plugins: Plugin[] = []
  _search: string

  constructor(
    private contactsService: ContactsService,
    private pluginsService: PluginsService,
    private progressBarService: ProgressBarService
  ) {
    this.isMobile = isMobile
    this.contactsService.getContacts().
      subscribe((data: Object) => this.contacts = data)
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

  set search(value: string) {
    this._search = value
    this.getPlugins(value)
  }

  get search(): string {
    return this._search
  }

}
