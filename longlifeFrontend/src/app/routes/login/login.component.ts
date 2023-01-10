import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../node-jwt/_services/auth.service';
import { TokenStorageService } from '../../node-jwt/_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private loginService: AuthService,private tokenService: TokenStorageService){}

  form: any = {};

  ngOnInit() {
  }

  login(){
    this.loginService.login(this.form).subscribe(
      (result: any) => {
        console.log(result)
        this.tokenService.saveUser(result)
      }
    )
  }
  getUser() {
    this.loginService.getUsers().subscribe(
      (result: any) => {
        console.log(result)
      }
    )
  }
  logout() {
    this.tokenService.signOut()
  }
}
