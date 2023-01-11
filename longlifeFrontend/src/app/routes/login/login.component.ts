import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../node-jwt/_services/auth.service';
import { TokenStorageService } from '../../node-jwt/_services/token-storage.service';
import { AuthLoginReturn, AuthLoginInfo } from '../../node-jwt/_models/login-info';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  constructor(private loginService: AuthService, private tokenService: TokenStorageService) { }

  form: AuthLoginInfo = { email: "", password: "" };

  ngOnInit() {
  }

  //Esegui login
  login() {
    this.loginService.login(this.form).subscribe(
      {
        next: ((value: AuthLoginReturn) => {
          //Salva utente nello storage
          this.tokenService.saveUser(value)
        }
        ),
        error: ((error: any) => {
          console.log(error)
        }
        ),
        complete:
          (() => {
            //Ricarica la pagina
            window.location.reload()
          })
      }
    )
  }
  //Trova utente corrente
  getUser() {
    console.log(this.tokenService.getUser())
  }
  //Esegui logout
  logout() {
    this.tokenService.signOut()
  }
}
