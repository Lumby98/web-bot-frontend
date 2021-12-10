import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject, Subscription} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthFacade} from "../../../../SharedModule/abstraction/auth.facade";
import {orderRegistrationFacade} from "../../../abstraction/orderRegistration.facade";
import {ProcessStepDto} from "../../../core/models/processStep.dto";
import {ProcessStepEnum} from "../../../core/enums/processStep.enum";
import {take, takeUntil} from "rxjs/operators";
import {LogEntryDto} from "../../../../log/presentation/dto/log-entry.dto";
import {OrderProcessDto} from "../../../core/models/order-process.Dto";
import {ProcessEnum} from "../../../core/enums/process.enum";

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
  listenForOrderLogSubscription: Subscription | undefined;
  listenProcessStepEventSubscription: Subscription | undefined;
  displayedColumns: string[] = ['OrderNum', 'Process', 'Completed','Message', 'CompletedAt'];
  currentOrderProcesses: OrderProcessDto[] = [];
  orderProcessCount: number = 0;



  constructor(private formBuilder: FormBuilder, private authFacade: AuthFacade, private orderRegistrationFacade: orderRegistrationFacade ) {
    this.error$ = this.orderRegistrationFacade.getErrorObservable();
    this.currentKey$ = this.authFacade.getCurrentKey();

    this.orderRegisterForm = this.formBuilder.group({
      orderNumbers: ['', Validators.required]
    })

  }
  get orderNumbers(){
    return this.orderRegisterForm.get('orderNumbers')
  }


  ngOnInit(): void {
    this.orderRegistrationFacade.listenForError().pipe(takeUntil(this.unsubscriber$)).subscribe();

    this.getOrderInfo$ = this.orderRegistrationFacade.getProcessStep(ProcessStepEnum.GETORDERINFO);
    this.getOrder$ = this.orderRegistrationFacade.getProcessStep(ProcessStepEnum.REGISTERORDER);
    this.allocateOrder$ = this.orderRegistrationFacade.getProcessStep(ProcessStepEnum.ALOCATEORDER);
    this.displayLogEntries$ = this.orderRegistrationFacade.getOrderLogEntries();
    this.allocateOrder$.pipe(takeUntil(this.unsubscriber$)).subscribe(processStep => {
      if (!this.startedRegistration) {
        this.orderRegistrationFacade.updateError('Receiving allocation events even though registration has not started');
        return;
      }

      if (!processStep){
        return;
      }

      if (!(this.currentOrderProcesses.length > 0)) {
        this.orderRegistrationFacade.updateError('List of orders currently being processed is empty');
        return;
      }

      if (!(this.orderProcessCount <= this.currentOrderProcesses.length)){
        this.orderRegistrationFacade.updateError('order process count exceeded the length of the list of orders');
        return;
      }

      if (processStep.error){
        this.currentOrderProcesses[this.orderProcessCount].process = ProcessEnum.FAIL;
        this.orderProcessCount++
        this.orderRegistrationFacade.clearProcessSteps();
      } else {
        this.currentOrderProcesses[this.orderProcessCount].process = ProcessEnum.COMPLETE;
        this.orderProcessCount++
        this.orderRegistrationFacade.clearProcessSteps();
      }

    });
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
    this.orderRegistrationFacade.clearLogEntries();
    this.orderRegistrationFacade.clearProcessSteps();
  }

  startOrderRegistration(){
    try {
      if (this.orderRegisterForm.invalid) {
        this.orderRegistrationFacade.updateError('Order number cannot be blank!');
      } else {

        if (this.startedRegistration) {
          this.orderRegistrationFacade.updateError('Order registration is already started!');
        } else {

          const orderNumbers = this.orderNumbers?.value.split(/\r?\n/);


          if (orderNumbers) {

            this.currentOrderProcesses = [];
            for (const orderNumber of orderNumbers){
              const orderProcess: OrderProcessDto = {orderNumber: orderNumber, process: ProcessEnum.LOADING}
              this.currentOrderProcesses.push(orderProcess);
            }

            this.orderProcessCount = 0;

            this.currentKey$.pipe(take(1)).subscribe(key => {
              if (key) {
                this.startedRegistration = true;
                this.listenProcessStepEventSubscription = this.orderRegistrationFacade
                  .listenForProcessStepEvent()
                  .pipe(takeUntil(this.unsubscriber$))
                  .subscribe();
                this.listenForOrderLogSubscription = this.orderRegistrationFacade
                  .listenForOrderLogEvent()
                  .pipe(takeUntil(this.unsubscriber$))
                  .subscribe();

                this.orderRegistrationFacade.startOrderRegistration({orderNumbers: orderNumbers, key: key});


              } else {
                this.orderRegistrationFacade.updateError('Could not get key');
              }


            }, error => {
              this.orderRegistrationFacade.updateError(error);
            });
          }else {
            this.orderRegistrationFacade.updateError('No Order Numbers');
          }


        }
      }
    }
    catch (error) {
      this.orderRegistrationFacade.updateError(error);
    }

  }

  stopOrderRegistration(){
    if(!this.startedRegistration){
      this.orderRegistrationFacade.updateError('Order registration is already stopped!');
    }
    else{
      this.startedRegistration = false;
      this.currentOrderProcesses = [];
      this.orderProcessCount = 0;
      this.listenProcessStepEventSubscription?.unsubscribe();
      this.listenForOrderLogSubscription?.unsubscribe();
      this.orderRegistrationFacade.clearLogEntries();
      this.orderRegistrationFacade.clearProcessSteps();
    }
  }


  /**
   * Calls the Facade to clear error from store.
   */
  clearError(){
    this.orderRegistrationFacade.clearError();
  }


  processStepToString(process: ProcessStepEnum): string{
    switch (process) {

      case ProcessStepEnum.GETORDERINFO:
        return 'Get order info';

      case ProcessStepEnum.REGISTERORDER:
        return 'Register order';

      case ProcessStepEnum.ALOCATEORDER:
        return 'Allocate order';


    }

  }



}
