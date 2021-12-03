import {OrderRegistrationService} from "../core/services/orderRegistration.service";
import {Store} from "@ngxs/store";
import {OrderRegistrationDto} from "../core/models/orderRegistrationDto";
import {Observable} from "rxjs";
import {LogEntryDto} from "../../SharedModule/core/models/LogEntry.dto";
import {tap} from "rxjs/operators";
import {
  ClearOrderRegLogEntryError, ClearOrderRegLogEntryStore, ClearProcessSteps,
  UpdateOrderRegLogEntryError,
  UpdateOrderRegLogEntryStore,
  UpdateProcessStep
} from "../core/state/orderReglogEntry.actions";
import {ProcessStepDto} from "../core/models/processStep.dto";
import {orderRegLogEntryState} from "../core/state/orderRegLogEntry.state";
import {ProcessStepEnum} from "../core/enums/processStep.enum";
import {Injectable} from "@angular/core";

@Injectable()
export class orderRegistrationFacade{
  constructor(private orderRegistrationService: OrderRegistrationService, private store: Store) {

  }

  startOrderRegistration(order: OrderRegistrationDto){
    this.orderRegistrationService.startOrderRegistration(order);
  }

  listenForOrderLogEvent(): Observable<LogEntryDto[]>{
    return this.orderRegistrationService.listenForOrderLogEvent().pipe(tap(logEntries => {
      this.store.dispatch(new UpdateOrderRegLogEntryStore(logEntries));
    }, e => {
        this.updateError(e);
      })
    );
  }

  listenForProcessStepEvent(): Observable<ProcessStepDto>{
    return this.orderRegistrationService.listenForProcessStepEvent().pipe(tap(processStep => {
        this.store.dispatch(new UpdateProcessStep(processStep));
      }, e => {
        this.updateError(e);
      })
    );
  }

  listenForError(): Observable<string>{
    return this.orderRegistrationService.listenForError().pipe(tap(err => {
        this.updateError(err)
      }, e => {
        this.updateError(e);
      })
    );
  }

  getErrorObservable(): Observable<any>{
    return this.store.select(orderRegLogEntryState.errorSelector);
  }

  clearError(){
    this.store.dispatch(new ClearOrderRegLogEntryError());
  }

  getProcessStep(type: ProcessStepEnum): Observable<ProcessStepDto | undefined> {
    return this.store.select(orderRegLogEntryState.processStep(type));
  }

  getOrderLogEntries(): Observable<LogEntryDto[]> {
    return this.store.select<LogEntryDto[]>(orderRegLogEntryState.orderRegLogEntries);
  }

  clearProcessSteps(){
    this.store.dispatch(new ClearProcessSteps());
  }

  clearLogEntries(){
    this.store.dispatch(new ClearOrderRegLogEntryStore());
  }

  updateError(err: any){
    this.store.dispatch(new UpdateOrderRegLogEntryError(err));
  }
}
