import { Component, OnInit } from '@angular/core';

import {ContactsService} from '../../services/contacts.service'
import {ProgressBarService} from '../../services/progress-bar.service';
import {isMobile} from '../../app.component'

declare var $: any

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
  plugins: any[] = [
    {name: 'JAVA', createdOn: '2013', description: ' JAVA is made by yash saraf', installs: '1 million'},
    {name: 'RUBY', createdOn: '2015', description: ' RUBY is made by yash saraf', installs: '2 million'},
    {name: 'JAVA', createdOn: '2013', description: ' JAVA is made by yash saraf', installs: '1 million'},
    {name: 'JAVA', createdOn: '2014', description: ' JAVA is made by yash saraf', installs: '1 million'},
    {name: 'PHP', createdOn: '2015', description: ' PHP is made by yash saraf', installs: '1 million'},
    {name: 'JAVA', createdOn: '2014', description: ' JAVA is made by yash saraf', installs: '1 million'},
    {name: 'PYTHON', createdOn: '2013', description: ' PHYTHON is made by yash saraf', installs: '1 million'},
    {name: 'PYTHON', createdOn: '2013', description: ' PHYTHON is made by yash saraf', installs: '1 million'},
    {name: 'PYTHON', createdOn: '2013', description: ' PHYTHON is made by yash saraf', installs: '1 million'},
    {name: 'PYTHON', createdOn: '2013', description: ' PHYTHON is made by yash saraf', installs: '1 million'},
    {name: 'PYTHON', createdOn: '2013', description: ' PHYTHON is made by yash saraf', installs: '1 million'},
    {name: 'PYTHON', createdOn: '2013', description: ' PHYTHON is made by yash saraf', installs: '1 million'},
    {name: 'PYTHON', createdOn: '2017', description: ' PHYTHON is made by yash saraf', installs: '1 million'}
  ]

  fplugins: any[] = [
    {name: 'JAVA', createdOn: '2013', description: ' JAVA is made by yash saraf', installs: '1 million'},
    {name: 'PHP', createdOn: '2015', description: ' PHP is made by yash saraf', installs: '1 million'},
    {name: 'PYTHON', createdOn: '2017', description: ' PHYTHON is made by yash saraf', installs: '1 million'},
    {name: 'RUBY', createdOn: '2015', description: ' RUBY is made by yash saraf', installs: '2 million'}
  ]

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

  getIdenticonObject(value: string, size: number) {
    let obj = {value, size}
    return JSON.stringify(obj)
  }

}
