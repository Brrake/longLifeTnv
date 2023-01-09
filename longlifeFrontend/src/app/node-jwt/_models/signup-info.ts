export class SignUpInfo {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  quest:string;
  answer:string;

  constructor(username: string, email: string, password: string,confirmPassword:string,quest:string, answer:string) {
      this.username = username;
      this.email = email;
      this.password = password;
      this.confirmPassword = confirmPassword;
      this.quest = quest;
      this.answer = answer;
  }
}
