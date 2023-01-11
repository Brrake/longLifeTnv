//Classe dedicata alla costruzione delle credenziali di login
export class AuthLoginInfo {
  email: string;
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
//Classe dedicata alla costruzione delle credenziali di ritorno dal login
export class AuthLoginReturn {
  email: string;
  name: string;
  token: string;
  roles: Array<any>;

  constructor(email: string, name: string, token: string, roles: Array<any>) {
    this.email = email;
    this.name = name;
    this.token = token;
    this.roles = roles;
  }
}
