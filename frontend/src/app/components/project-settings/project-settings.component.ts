import { Component, OnInit } from '@angular/core';
import {isMobile} from '../../app.component'

declare var $:any

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnInit {

  isMobile: boolean

  constructor() {
    this.isMobile = isMobile
  }

  ngOnInit() {
  }

  ngAfterViewInit(){

    $('.fullscreen.modal').modal('attach events', '#edit-run', 'show')
  }

}
