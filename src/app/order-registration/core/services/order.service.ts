import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Socket} from "ngx-socket-io";
import {OrderRegistrationDto} from "../models/orderRegistrationDto";
import {Observable} from "rxjs";
import {LogEntryDto} from "../models/LogEntry.dto";

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient, private socket: Socket) {
  }


  public startOrderRegistration(orderRegistrationDto: OrderRegistrationDto) {
    this.socket.emit('startOrderRegistration', orderRegistrationDto);
  }

  public listenForOrderLogEvent(): Observable<LogEntryDto>{
    return this.socket.fromEvent<LogEntryDto>('orderLogEvent');

  }

  /**
   * socket event listing for error messages
   */
  public listenForError(): Observable<string> {
    return this.socket.fromEvent<string>('error')
  }
}
