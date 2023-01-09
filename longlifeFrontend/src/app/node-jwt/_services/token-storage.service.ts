import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';

const USER_KEY = '67fhdje883n4njk'

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  public role: string | null;

  constructor(private cookieService: CookieService) {
    this.role = localStorage.getItem('role');
  }
  signOut() {
    this.deleteCookie(USER_KEY)
  }
  public saveUser(user: any) {
    user.logged = true
    var myValue = this.encryptData(JSON.stringify(user)) || ''
    this.setCookie(USER_KEY, myValue)
  }
  public getToken(): string {
    if (this.cookieService.get(USER_KEY)) {
      var myValue = JSON.parse(this.decryptData(this.cookieService.get(USER_KEY)));
      if (myValue.accessToken) {
        return myValue.accessToken;
      } else {
        return '';
      }
    } else {
      return ''
    }
  }
  public getUsername() {
    var myValue = JSON.parse(this.decryptData(this.cookieService.get(USER_KEY)));
    return myValue.username;
  }
  public getRoles() {
    var myValue = JSON.parse(this.decryptData(this.cookieService.get(USER_KEY))).roles;
    return myValue;
  }
  public getLoggedIn() {
    if (this.cookieService.get(USER_KEY)) {
      var myValue = JSON.parse(this.decryptData(this.cookieService.get(USER_KEY)));
      if (myValue.logged) {
        return myValue.logged;
      } else {
        return false;
      }
    } else {
      return false
    }
  }

  private encryptData(data: any) {

    try {
      return CryptoJS.AES.encrypt(JSON.stringify(data), environment.SESS_SECRET).toString();
    } catch (e) {
      console.log(e);
      return ''
    }
  }
  decryptData(data: any) {
    try {
      const bytes = CryptoJS.AES.decrypt(data, environment.SESS_SECRET);
      if (bytes.toString()) {
        return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
      }
      return data;
    } catch (e) {
      console.log(e);
    }
  }
  setCookie(name: string, value: string) {
    this.cookieService.set(name, value);
  }
  deleteCookie(name: string) {
    this.cookieService.delete(name);
  }
}
