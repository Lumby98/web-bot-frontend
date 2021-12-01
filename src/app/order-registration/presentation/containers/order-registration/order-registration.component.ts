import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthFacade} from "../../../../SharedModule/abstraction/auth.facade";
import {orderRegistrationFacade} from "../../../abstraction/orderRegistration.facade";
import {LogEntryDto} from "../../../../SharedModule/core/models/LogEntry.dto";
import {ProcessStepDto} from "../../../core/models/processStep.dto";
import {ProcessStepEnum} from "../../../core/enums/processStep.enum";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-order-registration',
  templateUrl: './order-registration.component.html',
  styleUrls: ['./order-registration.component.scss']
})
export class OrderRegistrationComponent implements OnInit, OnDestroy {
  unsubscriber$ = new Subject();
  startedRegistration: boolean = false;
  currentKey$: Observable<string>
  displayLogEntries$!: Observable<LogEntryDto[]>
  getOrderInfo$!: Observable<ProcessStepDto | undefined>
  getOrder$!: Observable<ProcessStepDto | undefined>
  allocateOrder$!: Observable<ProcessStepDto | undefined>
  error$!: Observable<any>;
  orderRegisterForm: FormGroup;


  constructor(private formBuilder: FormBuilder, private authFacade: AuthFacade, private orderRegistrationFacade: orderRegistrationFacade ) {
    this.error$ = this.authFacade.getErrorObservable();
    this.currentKey$ = this.authFacade.getCurrentKey();

    this.orderRegisterForm = this.formBuilder.group({
      orderNumbers: ['', Validators.required]
    })

  }

  ngOnInit(): void {
    this.orderRegistrationFacade.listenForError().pipe(takeUntil(this.unsubscriber$)).subscribe();
    this.orderRegistrationFacade.listenForProcessStepEvent().pipe(takeUntil(this.unsubscriber$)).subscribe();
    this.orderRegistrationFacade.listenForOrderLogEvent().pipe(takeUntil(this.unsubscriber$)).subscribe();

    this.getOrderInfo$ = this.orderRegistrationFacade.getProcessStep(ProcessStepEnum.GETORDERINFO);
    this.getOrder$ = this.orderRegistrationFacade.getProcessStep(ProcessStepEnum.GETORDER);
    this.allocateOrder$ = this.orderRegistrationFacade.getProcessStep(ProcessStepEnum.GETORDERINFO);
    this.displayLogEntries$ = this.orderRegistrationFacade.getOrderLogEntries();
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

  startOrderRegistration(){

  }


  /**
   * Calls the Facade to clear error from store.
   */
  clearError(){
    this.orderRegistrationFacade.clearError();
  }



}
