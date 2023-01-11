import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthLoginInfo} from '../_models/login-info';
import { SignUpInfo } from '../_models/signup-info';


const LOCAL = '//localhost:8000/api/';

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
  //Effettua il login
  login(credentials: AuthLoginInfo): Observable<any> {
    return this.http.post(LOCAL + 'login', credentials, httpOptions);
  }
  //Effetua la registrazione
  register(info: SignUpInfo): Observable<any> {
    return this.http.post(LOCAL + 'register', info, httpOptions);
  }
  /*
  logout(): Observable<any> {
    return this.http.post(LOCAL + 'logout', httpOptions);
  }
  getUsers(){
    return this.http.get(LOCAL + 'user', httpOptions);
  }
  */
}
