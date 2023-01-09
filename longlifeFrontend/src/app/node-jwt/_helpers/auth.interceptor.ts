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
    let authReq = req;
    const csrf = this.tokenExtractorService.getToken()

    /* N.B  Il jwt non viene intercettato perche viene salvato direttamente su un cookie */

    if (csrf != null && csrf != '') {
      authReq = authReq.clone({ headers: req.headers.set(XSRF_HEADER_KEY, csrf) });
    }

    authReq = authReq.clone({ withCredentials: true })
    return next.handle(authReq);
  }
}
export const authInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
];
