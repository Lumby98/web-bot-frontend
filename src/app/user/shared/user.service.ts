import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {UserDto} from "../../shared/dto/user.dto";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {EditUserDto} from "../../shared/dto/edit-user.dto";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  showUser: UserDto = {id: 0, username: 'placeholder', admin: 0}

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

  editUser(user: EditUserDto) {
    return this.http.patch(
      environment.apiUrl + '/user/' + user.username,
      user,
      {withCredentials: true})
  }
}
