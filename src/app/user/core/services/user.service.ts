import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {UserDto} from "../models/user.dto";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {EditUserDto} from "../models/edit-user.dto";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {
  }

  /**
   * calls the api the get all users
   */
  getUsers(): Observable<UserDto[]> {
    return this.http
      .get<UserDto[]>(
        environment.apiUrl + '/user/',
        {withCredentials: true});
  }

  /**
   * calls the api to remove a user
   * @param user
   */
  removeUser(user: UserDto) {
    return this.http
      .delete(
        environment.apiUrl + '/user/' + user.username,
        {withCredentials: true});
  }

  /**
   * calls the api to edit a user
   * @param username
   * @param user
   */
  editUser(username: string, user: EditUserDto) {
    return this.http.patch(
      environment.apiUrl + '/user/' + username,
      user,
      {withCredentials: true})
  }

  userById(id: number): Observable<UserDto> {
    return this.http.get<UserDto>(environment.apiUrl + /user/ + id, {withCredentials: true})
  }
}
