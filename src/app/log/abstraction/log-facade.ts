import {Injectable} from "@angular/core";
import {Store} from "@ngxs/store";
import {LogService} from "../core/services/log.service";
import {QueryDto} from "../../SharedModule/presentation/dto/filter/query.dto";
import {count, take, tap} from "rxjs/operators";
import {
  ClearLogEntryError,
  ClearLogEntryStore, DeleteLogEntry, InsertOrUpdateLogEntry,
  UpdateLogEntryCount,
  UpdateLogEntryError,
  UpdateLogEntryStore
} from "../core/state/logEntry.actions";
import {Observable} from "rxjs";
import {PaginationDto} from "../../SharedModule/presentation/dto/filter/pagination-dto";
import {LogEntryDto} from "../presentation/dto/log-entry.dto";
import {logEntryState} from "../core/state/logEntry.state";

@Injectable()
export class LogFacade {

  constructor(private logService: LogService,private store: Store) {}

  /*
  LogEntries *****
   */

  findAllFromApiPaginated(query: QueryDto){
    this.logService.findAll(query).pipe(take(1), tap( paginatedLogEntries => {
      if(paginatedLogEntries){
        this.store.dispatch(new ClearLogEntryStore());
        this.store.dispatch(new UpdateLogEntryStore(paginatedLogEntries.data));
        this.store.dispatch(new UpdateLogEntryCount(paginatedLogEntries.count));
      }else {
        this.updateError('failed to load logs')
      }
    })).subscribe();
  }

  getPaginatedLogEntries() : Observable<PaginationDto<LogEntryDto>>{
    return this.store.select<PaginationDto<LogEntryDto>>(logEntryState.paginatedLogEntries);
  }

  getLogEntries() : Observable<LogEntryDto[]>{
    return this.store.select<LogEntryDto[]>(logEntryState.logEntries);
  }

  removeLogEntry(logEntry: LogEntryDto){
    this.getCountObservable().pipe(take(1)).subscribe(count => {
      const newCount = count-1
      this.store.dispatch(new DeleteLogEntry(logEntry));
      this.store.dispatch(new UpdateLogEntryCount(newCount))
      this.logService.remove(logEntry.id).subscribe( succes => {


        },
        error => {
          this.updateError(error);
          this.store.dispatch(new InsertOrUpdateLogEntry(logEntry));
          this.store.dispatch(new UpdateLogEntryCount(count))
        });
    })

    }




  removeAllLogEntries(){
    let logEntries: LogEntryDto[] = [];
    this.store.selectOnce(logEntryState.logEntries).subscribe( logEntriesSub => {
      logEntries = logEntriesSub;
      this.store.dispatch(new ClearLogEntryStore());
      this.logService.removeAll().subscribe( succes => {

        },
        error => {
          this.updateError(error);
          this.store.dispatch(new UpdateLogEntryStore(logEntries));
        })
    });
  }

  /*
  Error *****
   */

  getErrorObservable(): Observable<any> {
    return this.store.select(logEntryState.errorSelector)
  }

  clearError(){
    this.store.dispatch(new ClearLogEntryError);
  }

  updateError(error: any){
    this.store.dispatch(new UpdateLogEntryError(error));
  }

  getCountObservable(): Observable<number>{
    return this.store.select(logEntryState.count)
  }





}
