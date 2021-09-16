import {Injectable} from '@angular/core';
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

  constructor(private http: HttpClient ) { }

  login(login: LoginDto): Observable<boolean> {
    return this.http
      .post<any>(environment.apiUrl + '/authentication/log-in',
        login, {observe: "response", withCredentials: true}
      )
      .pipe(
      map(response => {
        const token = this.doesHttpOnlyCookieExist('Authentication');
        if(token) {
          localStorage.setItem('currentUser', JSON.stringify(response));
          return true;
        } else {
          throw new Error('wrong credentials (auth service)')
        }
      }), catchError( () => {
        throw new Error('failed to login: wrong credentials');
      }));
  }

  doesHttpOnlyCookieExist(cookieName: string) {
    var d = new Date();
    d.setTime(d.getTime() + (1000));
    var expires = "expires=" + d.toUTCString();

    document.cookie = cookieName + "=new_value;path=/;" + expires;
    return document.cookie.indexOf(cookieName + '=') == -1;
  }

  register(registerDto: RegisterDto): Observable<boolean>{
    return this.http
      .post<any>(
        environment.apiUrl + '/authentication/register',
        registerDto,
        {withCredentials: true}
      )
      .pipe(
        map(() => {
          const user = localStorage.getItem('currentUser')
          let m: any
          if(user){
            m = JSON.parse(user)
            console.log(m);
          } else {
            throw new Error('could not create user')
          }

      if(m.body.admin == 1) {
        return true;
      } else {
        throw new Error('could not create user')
      }
    }), catchError(err => {
      throw Error(err.message)
    }));
  }

  logout(): Observable<boolean>{
    try {
      const user = localStorage.getItem('currentUser');
      let m: UserDto
      if(!user) {
        throw new Error('could not logout');
      }
      m = JSON.parse(user);
      localStorage.removeItem('currentUser');
      return this.http
        .post(
          environment.apiUrl + '/authentication/log-out',
          m,
          {withCredentials: true}
        )
        .pipe(
          map(() => {
            return true;
          }), catchError(err => {
            throw err
          })
        );

    } catch (err) {
      throw err;
    }
  }

  isAuthenticated() {
    //checks if the token is set
    return this.doesHttpOnlyCookieExist('Authentication');


  }
}
