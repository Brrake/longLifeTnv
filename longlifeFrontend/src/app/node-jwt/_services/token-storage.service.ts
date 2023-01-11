import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import * as CryptoJS from 'crypto-js';
import { CookieService } from 'ngx-cookie-service';
import { AuthLoginReturn } from '../_models/login-info';
import { ErrorInfo } from '../_models/error-info';

const USER_KEY = 'USER'

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  //Errore personalizzato
  err:ErrorInfo = {
    message: "Nessun utente trovato",
    success: true
  }

  constructor() { }

  //Logout dall'applicazione
  signOut() {
    //Cancella tutti i dati salvati nello storage
    sessionStorage.clear();
    localStorage.clear();
  }
  //Salva utente nello storage
  saveUser(user: AuthLoginReturn) {
    //Aggiungi l'utente nello storage con key USER_KEY e come valore l'utente in ingresso convertito in JSON string cryptato
    sessionStorage.setItem(USER_KEY, this.encryptData(JSON.stringify(user)))
  }
  //Ottieni utente corrente
  getUser(): AuthLoginReturn | ErrorInfo {
    //Se nello storage è salvato qualche utente
    if (sessionStorage.getItem(USER_KEY)) {
      //Assegna a myUser la JSON string decriptata converita in Object
      var myUser: AuthLoginReturn = JSON.parse(this.decryptData(sessionStorage.getItem(USER_KEY)));
      if (myUser != null && myUser != undefined) {
        return myUser
      } else {
        return this.err
      }
    } else {
      return this.err
    }
  }
  //Ottieni token
  getToken():String|ErrorInfo {
    //Se nello storage è salvato qualche utente
    if (sessionStorage.getItem(USER_KEY)) {
      //Assegna a myUser la JSON string decriptata converita in Object
      var myUser = JSON.parse(this.decryptData(sessionStorage.getItem(USER_KEY)));
      if (myUser != null && myUser != undefined) {
        return myUser.token
      } else {
        return this.err
      }
    } else {
      return this.err
    }
  }
  getLoggedIn(): boolean {
    //Se nello storage è salvato qualche utente
    if (sessionStorage.getItem(USER_KEY)) {
      //Assegna a myUser la JSON string decriptata converita in Object
      var myUser = JSON.parse(this.decryptData(sessionStorage.getItem(USER_KEY)));
      if (myUser.token != null && myUser.token != undefined) {
        return true
      } else {
        return false
      }
    } else {
      return false
    }
  }

  // Crypto Functions
  encryptData(data: any) {
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
}
