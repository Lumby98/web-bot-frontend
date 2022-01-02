import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Socket} from "ngx-socket-io";
import {OrderRegistrationDto} from "../models/orderRegistrationDto";
import {Observable} from "rxjs";
import {ProcessStepDto} from "../models/processStep.dto";
import {LogEntryDto} from "../../../log/presentation/dto/log-entry.dto";

@Injectable({
  providedIn: 'root'
})
export class OrderRegistrationService {

  constructor(private http: HttpClient, private socket: Socket) {
  }

  /**
   * starts order registration from the given order registration DTO
   * @param orderRegistrationDto
   */
  public startOrderRegistration(orderRegistrationDto: OrderRegistrationDto) {
    this.socket.emit('startOrderRegistration', orderRegistrationDto);
  }

  /**
   * socket event listening for entries being added to the log
   */
  public listenForOrderLogEvent(): Observable<LogEntryDto[]>{
    return this.socket.fromEvent<LogEntryDto[]>('orderLogEvent');
  }

  /**
   * socket event listening for process step events
   */
  public listenForProcessStepEvent(): Observable<ProcessStepDto> {
    return this.socket.fromEvent<ProcessStepDto>('processStepEvent');
  }

  /**
   * socket event listening for error messages
   */
  public listenForError(): Observable<string> {
    return this.socket.fromEvent<string>('error')
  }
}
