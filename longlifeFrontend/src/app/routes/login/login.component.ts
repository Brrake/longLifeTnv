import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../node-jwt/_services/auth.service';
import { TokenStorageService } from '../../node-jwt/_services/token-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private loginService: AuthService, private tokenService: TokenStorageService) { }

  form: any = {};

  ngOnInit() {
  }

  login() {
    this.loginService.login(this.form).subscribe(
      {
        next: ((value: any) => {
          this.tokenService.saveUser(value)
        }
        ),
        error: ((error: any) => {
          console.log(error)
        }
        ),
        complete:
          (() => {
            window.location.reload()
          })
      }
    )
  }
  getUser() {
    console.log(this.tokenService.getUser())
  }
  logout() {
    this.tokenService.signOut()
  }
}
