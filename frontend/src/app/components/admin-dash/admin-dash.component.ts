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
import {StatsService} from '../../services/stats.service'

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
  plugins = 0
  users = 0
  developers = 0

  constructor(private statsService: StatsService) {
    this.isMobile = isMobile
    this.pieSize = this.isMobile ? '300px' : '600px'
  }

  ngAfterViewInit() {

    // A workaround for google undefined error.
    // FIXME
    let statsService = this.statsService
    let loadCharts = () => {
      statsService.getPluginsPerInstalls().subscribe(data => this.pieChart(data))
      // statsService.getPluginsPerInstalls().subscribe(data => this.usersChart(data))
      // statsService.getPluginsPerInstalls().subscribe(data => this.pluginsChart(data))

      // Any calls to the backend or for loading any chart should be made here.
    }

    setTimeout(() => this.heading.emit('Dashboard'))
    google.charts.load('current', {packages:['corechart']})
    google.charts.load('current', {'packages':['line']})
    google.charts.setOnLoadCallback(loadCharts)

    this.statsService.getTotalCount().subscribe(
      data => {
        this.plugins = data.plugins
        this.users = data.users
        this.developers = data.developers
      }
    )
  }

  pieChart(pluginInstallsData: any) {
    for (let i = 0; i < pluginInstallsData.length; i++) {
      pluginInstallsData[i][1] = parseInt(pluginInstallsData[i][1])
    }
    let data = new google.visualization.DataTable()
    data.addColumn('string', 'Plugins')
    data.addColumn('number', 'Installs')
    data.addRows(pluginInstallsData)

    var options = {
      backgroundColor: {
        fill: 'transparent'
      },
      title: 'Installed Plugins',
      is3D: true,
      chartArea: {width: 750}
    };

    var chart = new google.visualization.PieChart(document.getElementById('piechart_3d'));
    chart.draw(data, options);
  }

  usersChart(totalUsers: any) {
    for (let i = 0; i < totalUsers.length; i++) {
      totalUsers[i][1] = parseInt(totalUsers[i][1])
    }
    var data = new google.visualization.DataTable();
    data.addColumn('date', 'Months');
    data.addColumn('number', 'Users');

    data.addRows(totalUsers)

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

  pluginsChart(totalPlugins: any) {
    for (let i = 0; i < totalPlugins.length; i++) {
      totalPlugins[i][1] = parseInt(totalPlugins[i][1])
    }
    var data = new google.visualization.DataTable()
    data.addColumn('date', 'Months')
    data.addColumn('number', 'Plugins')

    data.addRows(totalPlugins)

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
