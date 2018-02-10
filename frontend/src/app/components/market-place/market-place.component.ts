import { Component, OnInit } from '@angular/core';

import {ContactsService} from '../../services/contacts.service'
import {ProgressBarService} from '../../services/progress-bar.service';
import {isMobile} from '../../app.component'

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

  constructor(
    private contactsService: ContactsService,
    private progressBarService: ProgressBarService
  ) {
    this.isMobile = isMobile
    this.contactsService.getContacts().
      subscribe((data: Object) => this.contacts = data)
  }

  ngOnInit() {
  }

}
