import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Socket} from "ngx-socket-io";
import {OrderRegistrationDto} from "../models/orderRegistrationDto";
import {Observable} from "rxjs";
import {LogEntryDto} from "../../../SharedModule/core/models/LogEntry.dto";
import {ProcessStepDto} from "../models/processStep.dto";

@Injectable({
  providedIn: 'root'
})
export class OrderRegistrationService {

  constructor(private http: HttpClient, private socket: Socket) {
  }


  public startOrderRegistration(orderRegistrationDto: OrderRegistrationDto) {
    this.socket.emit('startOrderRegistration', orderRegistrationDto);
  }

  public listenForOrderLogEvent(): Observable<LogEntryDto[]>{
    return this.socket.fromEvent<LogEntryDto[]>('orderLogEvent');
  }

  public listenForProcessStepEvent(): Observable<ProcessStepDto> {
    return this.socket.fromEvent<ProcessStepDto>('processStepEvent');
  }

  /**
   * socket event listing for error messages
   */
  public listenForError(): Observable<string> {
    return this.socket.fromEvent<string>('error')
  }
}
