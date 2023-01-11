//Classe dedicata alla costruzione delle credenziali di registrazione
export class SignUpInfo {
  name: string;
  email: string;
  password: string;


  constructor(name: string, email: string, password: string) {
      this.name = name;
      this.email = email;
      this.password = password;
  }
}
