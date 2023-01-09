import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Access-Control-Allow-Origin': ['https://www.brake4food.it']
  })
};
@Injectable({
  providedIn: 'root'
})
export class UserService {


  url:string = "//auth.brake4food.it/api/test/"
  urlLocal:string = "//localhost:8080/api/test/"

  constructor(private http: HttpClient) {
   }

  isAdmin() {
    return this.http.get<any>(this.urlLocal+"admin", httpOptions);
  }
  getRealEmail() {
    return this.http.get<any>(this.urlLocal+"email", httpOptions);
  }
}
