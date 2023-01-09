import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../node-jwt/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private loginService: AuthService){}

  form: any = {};

  ngOnInit() {
  }

  login(){
    console.log(this.form)
    this.loginService.login(this.form).subscribe(
      (result: any) => {
        console.log(result)
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
    this.loginService.logout().subscribe(
      (result: any) => {
        console.log(result)
      }
    )
  }
}
