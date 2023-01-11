import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';

const USER_KEY = '67fhdje883n4njk'
const JWT_KEY = 'JWT'

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {


  constructor(private cookieService: CookieService) {
  }
  signOut() {
    sessionStorage.clear();
    localStorage.clear();
  }
  public saveUser(user: any) {
    sessionStorage.setItem(USER_KEY,this.encryptData(JSON.stringify(user)))
  }
  public getUser() {
    if (sessionStorage.getItem(USER_KEY)) {
      var myUser = JSON.parse(this.decryptData(sessionStorage.getItem(USER_KEY)));
      if(myUser != null && myUser != undefined){
        return myUser
      }
    }else{
      var err = {
        message: "Nessun utente trovato",
        err:true
      }
      return err
    }
  }
  public getToken() {
    if (sessionStorage.getItem(USER_KEY)) {
      var myUser = JSON.parse(this.decryptData(sessionStorage.getItem(USER_KEY)));
      if(myUser != null && myUser != undefined){
        return myUser.token
      }
    }else{
      var err = {
        message: "Nessun utente trovato",
        err:true
      }
      return err
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
