import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../../environments/environment";
import {RegisterInsoleDto} from "../models/register-insole.dto";
import {Observable} from "rxjs";
import {Socket} from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class InsoleService {

  constructor(private http: HttpClient, private socket: Socket) {
  }

  /**
   * calls the api to register insoles
   * registerInsoleDto contains a username, password and a list of insoles
   * @param insoles
   */
  registerInsoles(insoles: RegisterInsoleDto) {
    return this.http.post(environment.apiUrl + '/insole', insoles, {responseType: "text"});
  }

  public listenForInsoleRegistration(dto: RegisterInsoleDto): Observable<string> {
    this.socket.emit('startInsoleRegistration', dto);

    return this.socket.fromEvent<string>('completeInsoleRegistration');
  }

  /**
   * socket event listing for error messages
   */
  public listenForError(): Observable<string> {
    return this.socket.fromEvent<string>('error')
  }
}
