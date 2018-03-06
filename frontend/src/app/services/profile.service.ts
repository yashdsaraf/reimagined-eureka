import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import {Observable} from 'rxjs/Observable'
import {User} from '../models/user'

@Injectable()
export class ProfileService {

  constructor(private http: HttpClient) { }

  getUserDetails(): Observable<User> {
    return this.http.get<User>('/profile')
  }

  setUserDetails(user:User, password:string): Observable<any> {
    let formData = new FormData()
    formData.append('user', JSON.stringify(user))
    formData.append('password', password)
    return this.http.post('/profile', formData)
  }

}
