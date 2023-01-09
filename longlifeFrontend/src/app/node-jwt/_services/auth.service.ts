import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthLoginInfo, VerifyLoginInfo, VerifyResetPassInfo, ResetPassInfo, VerifyQuestInfo, VerifyOtpInfo } from '../_models/login-info';
import { SignUpInfo } from '../_models/signup-info';


const LOCAL = '//localhost:8000/api/';
const LOCAL_COOKIE = '//localhost:8000/';
const LOCAL_USER = '//localhost:8000/api/users/';
const LOCAL_GOOGLE = '//localhost:8000/api/google/';
const LOCAL_EMAIL = '//localhost:8000/api/';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': ['http://localhost:4200']
  })
};
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private http: HttpClient) { }
  //RESET PASSWORD - Verify if username match with email
  //GET_USERS
  getUsers(){
    return this.http.get(LOCAL + 'user', httpOptions);
  }
  login(credentials: VerifyLoginInfo): Observable<any> {
    return this.http.post(LOCAL + 'login', credentials, httpOptions);
  }
  register(info: SignUpInfo): Observable<any> {
    return this.http.post(LOCAL + 'register', info, httpOptions);
  }
  logout(): Observable<any> {
    return this.http.post(LOCAL + 'logout', httpOptions);
  }
}
