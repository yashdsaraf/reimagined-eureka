import { Component, OnInit } from '@angular/core';
import {isMobile} from '../../app.component'
import {Themes} from '../../utils/themes';

declare const $: any

@Component({
  selector: 'app-project-settings',
  templateUrl: './project-settings.component.html',
  styleUrls: ['./project-settings.component.sass']
})
export class ProjectSettingsComponent implements OnInit {

  isMobile: boolean
  selectedTheme = 'github'
  themes: string[]

  constructor() {
    this.isMobile = isMobile
    this.themes = Themes
    console.log(Themes)
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    $('.fullscreen.modal').modal('attach events', '#edit-run', 'show')
  }

}
