import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.sass'],
})

export class HelpComponent implements OnInit {

@Input("redirectDoc") Doc:string

  constructor() { }

  ngOnInit() {
  }

}
