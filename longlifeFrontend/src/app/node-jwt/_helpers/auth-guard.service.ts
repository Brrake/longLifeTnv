import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router, private tokenStorage: TokenStorageService) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    //Se l'utente è loggato
    if(this.tokenStorage.getLoggedIn()){
      //Allora ritorna il valore probabilemnte true
      return this.tokenStorage.getLoggedIn()
    }else{
      //Altrimenti torna alla pagina principale
      this.router.navigate(['/'])
      .then(() => {
        window.location.reload
      }).catch(err => {
        console.log(err);
      });
      //Poi ritorna false
      return false;
    }
  }
}
