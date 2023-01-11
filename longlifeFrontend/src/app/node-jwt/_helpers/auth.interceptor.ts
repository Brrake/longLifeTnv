import { HTTP_INTERCEPTORS, HttpEvent, HttpXsrfTokenExtractor } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { TokenStorageService } from '../_services/token-storage.service';
import { Observable } from 'rxjs';

const TOKEN_HEADER_KEY = 'x-access-token';       // for Spring Boot back-end
const XSRF_HEADER_KEY = 'X-XSRF-TOKEN';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private token: TokenStorageService, private tokenExtractorService: HttpXsrfTokenExtractor) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    //Richiesta clonata
    let authReq = req;
    //Token JWT convertito in stringa per sicurezza
    const accessToken = this.token.getToken().toString();
    //Token CSRF
    const csrf = this.tokenExtractorService.getToken()

    //Se il token JWT è diverso da null e da una stringa vuota
    if (accessToken != null && accessToken != '') {
      //Se il token CSRF è diverso da null e da una stringa vuota
      if(csrf != null && csrf != ''){
        //Allora aggiungi entrambi gli header alla richiesta
        authReq = authReq.clone({ headers: req.headers.set(XSRF_HEADER_KEY, csrf).set(TOKEN_HEADER_KEY, accessToken) });
      }else{
        //Senno aggiungi solo il token JWT
        authReq = authReq.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, accessToken) });
      }
    }else{
      //Senno se il token CSRF è diverso da null e da una stringa vuota
      if(csrf != null && csrf != ''){
        //Aggiungi solo il token CSRF
        authReq = authReq.clone({ headers: req.headers.set(XSRF_HEADER_KEY, csrf) });
      }
    }
    //Aggiungi le credenziali alla richiesta - concede la possibilità di scambiarsi i cookie a vicenda purchè rispettino i limiti imposti
    authReq = authReq.clone({ withCredentials: true })
    return next.handle(authReq);
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
