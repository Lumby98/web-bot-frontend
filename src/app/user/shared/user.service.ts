import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {UserDto} from "../../shared/dto/user.dto";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUsers(): Observable<UserDto[]> {
    return this.http
      .get<UserDto[]>(
        environment.apiUrl + '/user/',
        {withCredentials: true});
  }

  removeUser(user: UserDto) {
    return this.http
      .delete(
        environment.apiUrl + '/user/' + user.username,
        {withCredentials: true});
  }
}
