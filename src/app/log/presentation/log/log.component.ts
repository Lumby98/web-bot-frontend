import {Component, OnDestroy, OnInit} from '@angular/core';
import {LogFacade} from "../../abstraction/log-facade";
import {Observable, Subject} from "rxjs";
import {PaginationDto} from "../../../SharedModule/presentation/dto/filter/pagination-dto";
import {LogEntryDto} from "../dto/log-entry.dto";
import {QueryDto} from "../../../SharedModule/presentation/dto/filter/query.dto";
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {PageEvent} from "@angular/material/paginator";
import {debounceTime, distinctUntilChanged, takeUntil} from "rxjs/operators";
import {ProcessStepEnum} from "../../../order-registration/core/enums/processStep.enum";

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit, OnDestroy {
  unsubscriber$ = new Subject();
  error$!: Observable<any>;
  paginatedLogEntries$!: Observable<PaginationDto<LogEntryDto>>;
  LogEntries$!: Observable<LogEntryDto[]>;
  displayedColumns: string[] = ['OrderNum', 'Process', 'Completed','Message', 'CompletedAt'];
  queryForm = new FormControl("");
  length$!: Observable<number>;
  pageSize = 25;
  pageIndex = 0;
  pageSizeOptions = [25, 50, 100];
  showFirstLastButtons = true;

  constructor(private formBuilder: FormBuilder, private logFacade: LogFacade) {

  }



  ngOnInit(): void {
    this.queryForm.valueChanges
      .pipe(takeUntil(this.unsubscriber$), debounceTime(500),distinctUntilChanged())
      .subscribe( (value) => {
        this.submitQueryForm();

      });

    this.error$ = this.logFacade.getErrorObservable();
    this.length$ = this.logFacade.getCountObservable();
    this.paginatedLogEntries$ = this.logFacade.getPaginatedLogEntries();
    this.LogEntries$ = this.logFacade.getLogEntries();
    this.findAllFromApiPaginated({page: this.pageIndex +1, take: this.pageSize, keyword: ""});
  }

  handlePageEvent(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.submitQueryForm();
  }

  submitQueryForm(){
    try{
      this.findAllFromApiPaginated({page: this.pageIndex +1, take: this.pageSize, keyword: this.queryForm.value})
    }
    catch (e) {
      this.updateError(e);
    }
  }

  findAllFromApiPaginated(query: QueryDto){
    this.logFacade.findAllFromApiPaginated(query);
  }

  removeLogEntry(logEntry: LogEntryDto){
    this.logFacade.removeLogEntry(logEntry);
  }

  removeAllLogEntries(){
    this.logFacade.removeAllLogEntries();
  }

  /**
   * Calls the Facade to clear error from store.
   */
  clearError(){
    this.logFacade.clearError();
  }

  updateError(error: any){
    this.logFacade.updateError(error);
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
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
