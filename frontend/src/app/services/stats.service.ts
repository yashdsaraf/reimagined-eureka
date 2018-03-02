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

  getPluginsPerInstalls(): Observable<any>{
    return this.http.get('/api/stats/installs')
  }
}
