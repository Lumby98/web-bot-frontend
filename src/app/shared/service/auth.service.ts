import {Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";
import {LoginDto} from "../dto/login.dto";
import {RegisterDto} from "../dto/register.dto";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {catchError, map} from "rxjs/operators";
import {environment} from "../../../environments/environment";
import {UserDto} from "../dto/user.dto";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private cookieService: CookieService,
              private http: HttpClient,
              ) { }

  login(login: LoginDto): Observable<boolean> {
    return this.http.post<any>(environment.apiUrl + '/authentication/log-in', login)
      .pipe(
        map(response => {
      const token = this.cookieService.get('Authentication');
      console.log(token + " hello");
      console.log(response);

      if(token) {
        localStorage.setItem('currentUser', JSON.stringify(response));
        return true;
      } else {
        throw new Error('wrong credentials (auth service)')
      }
    }), catchError( err => {
      throw Error(err.message)
    }));
  }

  register(registerDto: RegisterDto): Observable<boolean>{
    return this.http.post<any>(environment.apiUrl + '/authentication/register', registerDto)
      .pipe(
        map(response => {
      const token = this.cookieService.get('Authentication');
      console.log(token);

      if(token) {
        return true;
      } else {
        throw new Error('could not create user')
      }
    }), catchError(err => {
      throw Error(err.message)
    }));
  }

  logout(){
    //get user from local storage
    const user = localStorage.RemoveItem('currentUser');
    this.http.post('log-out', user);
  }

  isAuthenticated() {
    //get the authentication token from cookie
    const token = this.cookieService.get('Authentication');

    //checks if the token is set
    return !!token;


  }
}
