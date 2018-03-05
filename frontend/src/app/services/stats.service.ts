import {Injectable} from '@angular/core'
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Observable'

@Injectable()
export class StatsService {

  constructor(private http: HttpClient) {
  }

  getTotalCount(): Observable<any>{
    return this.http.get('/api/stats/count')
  }

  getUserPerMonth(): Observable<any>{
    return this.http.get('/api/stats/users')
  }

  getPluginsPerMonth(): Observable<any>{
    return this.http.get('/api/stats/plugins')
  }

  getPluginsPerInstalls(): Observable<any>{
    return this.http.get('/api/stats/installs')
  }
}
