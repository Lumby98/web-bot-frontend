import {OrderRegistrationService} from "../core/services/orderRegistration.service";
import {Store} from "@ngxs/store";
import {OrderRegistrationDto} from "../core/models/orderRegistrationDto";
import {Observable} from "rxjs";
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
import {LogEntryDto} from "../../log/presentation/dto/log-entry.dto";

@Injectable()
export class orderRegistrationFacade{
  constructor(private orderRegistrationService: OrderRegistrationService, private store: Store) {

  }

  /**
   * start registering orders
   * @param order
   */
  startOrderRegistration(order: OrderRegistrationDto){
    this.orderRegistrationService.startOrderRegistration(order);
  }

  /**
   * listens for an order log event
   */
  listenForOrderLogEvent(): Observable<LogEntryDto[]>{
    return this.orderRegistrationService.listenForOrderLogEvent().pipe(tap(logEntries => {
      this.store.dispatch(new UpdateOrderRegLogEntryStore(logEntries));
    }, e => {
        this.updateError(e);
      })
    );
  }

  /**
   * listens for a process step event
   */
  listenForProcessStepEvent(): Observable<ProcessStepDto>{
    return this.orderRegistrationService.listenForProcessStepEvent().pipe(tap(processStep => {
        this.store.dispatch(new UpdateProcessStep(processStep));
      }, e => {
        this.updateError(e);
      })
    );
  }

  /**
   * listens for an error
   */
  listenForError(): Observable<string>{
    return this.orderRegistrationService.listenForError().pipe(tap(err => {
        this.updateError(err)
      }, e => {
        this.updateError(e);
      })
    );
  }

  /**
   * gets the observable for the error
   */
  getErrorObservable(): Observable<any>{
    return this.store.select(orderRegLogEntryState.errorSelector);
  }

  /**
   * clears errors using the ClearOrderRegLogEntryError method
   */
  clearError(){
    this.store.dispatch(new ClearOrderRegLogEntryError());
  }

  /**
   * gets the given enumerator value as an observable value of ProcessStepDto
   * @param type
   */
  getProcessStep(type: ProcessStepEnum): Observable<ProcessStepDto | undefined> {
    return this.store.select(orderRegLogEntryState.processStep(type));
  }

  /**
   * gets order log entries
   */
  getOrderLogEntries(): Observable<LogEntryDto[]> {
    return this.store.select<LogEntryDto[]>(orderRegLogEntryState.orderRegLogEntries);
  }

  /**
   * clears process steps
   */
  clearProcessSteps(){
    this.store.dispatch(new ClearProcessSteps());
  }

  /**
   * clears log entries
   */
  clearLogEntries(){
    this.store.dispatch(new ClearOrderRegLogEntryStore());
  }

  /**
   * updates the error with the given value
   * @param err
   */
  updateError(err: any){
    this.store.dispatch(new UpdateOrderRegLogEntryError(err));
  }
}
