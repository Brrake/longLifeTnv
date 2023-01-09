import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, take } from 'rxjs';
import { UserService } from '../_services/user.service';
import { TokenStorageService } from '../_services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  private isLoggedIn: boolean = false;

  constructor(private router: Router, private testUser: UserService, private tokenStorage: TokenStorageService) {

  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if(this.tokenStorage.getLoggedIn()){
      return this.tokenStorage.getLoggedIn()
    }else{
      this.router.navigate(['/'])
      .then(() => {
        window.location.reload
      }).catch(err => {
        console.log(err);
      });
      return false;
    }
  }
}
