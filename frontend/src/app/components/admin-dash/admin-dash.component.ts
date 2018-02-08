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
  Output
} from '@angular/core'
import {isMobile} from '../../app.component'

declare const google: any

@Component({
  selector: 'app-admin-dash',
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.sass']
})
export class AdminDashComponent {

  @Output('heading') heading = new EventEmitter()
  isMobile: boolean
  pieSize: string

  constructor() {
    this.isMobile = isMobile
    this.pieSize = this.isMobile ? '300px' : '600px'
  }

  ngAfterViewInit() {
    let loadCharts = () => {
      google.charts.load("current", {packages:["corechart"]})
      google.charts.load('current', {'packages':['line']})
      google.charts.setOnLoadCallback(this.usersChart)
      google.charts.setOnLoadCallback(this.pieChart)
      google.charts.setOnLoadCallback(this.pluginsChart)
    }
    setTimeout(() => this.heading.emit('Dashboard'))
    if (google != null && google != undefined) {
      loadCharts()
    }
  }

  pieChart() {
    var data = google.visualization.arrayToDataTable([
      ['Task', 'Hours per Day'],
      ['Work',     11],
      ['Eat',      2],
      ['Commute',  2],
      ['Watch TV', 2],
      ['Sleep',    7]
    ]);

    var options = {
      backgroundColor: {
        fill: 'transparent'
      },
      title: 'My Daily Activities',
      is3D: true,
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
    chart.draw(data, options);
  }

  usersChart() {
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Months');
    data.addColumn('number', 'Users');

    data.addRows([
      [new Date(2014, 0), 6.3],
      [new Date(2014, 1), 6.2],
      [new Date(2014, 2), 7.6],
      [new Date(2014, 3), 12.9],
      [new Date(2014, 4), 18.3],
      [new Date(2014, 5), 22.6],
      [new Date(2014, 6), 25.6],
      [new Date(2014, 7), 27.9],
      [new Date(2014, 8), 29.2],
      [new Date(2014, 9), 40.9],
      [new Date(2014, 10), 61.0],
      [new Date(2014, 11), 75.5]
    ])


    var options = {
      backgroundColor: {
        fill: 'transparent'
      },
      chart: {
        title: 'Total Number of Users',
      },
      hAxis: {
        title: 'in months'
      },
      vAxis: {
        title: 'No. of users'
      },
      axes: {
        x: {
          0: {side: 'bottom'}
        }
      }
    }

    var chart = new google.charts.Line(document.getElementById('line_top_x'))

    chart.draw(data, google.charts.Line.convertOptions(options))
  }


  pluginsChart() {
    var data = new google.visualization.DataTable()
    data.addColumn('date', 'Months')
    data.addColumn('number', 'Plugins')

    data.addRows([
      [new Date(2014, 0), 6.3],
      [new Date(2014, 1), 6.2],
      [new Date(2014, 2), 7.6],
      [new Date(2014, 3), 12.9],
      [new Date(2014, 4), 18.3],
      [new Date(2014, 5), 22.6],
      [new Date(2014, 6), 25.6],
      [new Date(2014, 7), 27.9],
      [new Date(2014, 8), 29.2],
      [new Date(2014, 9), 40.9],
      [new Date(2014, 10), 61.0],
      [new Date(2014, 11), 75.5]
    ])


    var options = {
      backgroundColor: {
        fill: 'transparent'
      },
      chart: {
        title: 'Total Number of Plugins',
      },
      hAxis: {
        title: 'in months'
      },
      vAxis: {
        title: 'No. of Plugins'
      },
      axes: {
        x: {
          0: {side: 'bottom'}
        }
      }
    }

    var chart = new google.charts.Line(document.getElementById('line_down_x'))

    chart.draw(data, google.charts.Line.convertOptions(options))
  }

}
