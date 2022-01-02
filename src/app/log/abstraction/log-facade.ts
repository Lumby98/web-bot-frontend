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
import {UpdateLogDto} from "../presentation/dto/update-log.dto";

@Injectable()
export class LogFacade {

  constructor(private logService: LogService,private store: Store) {}

  /*
  LogEntries *****
   */
  /**
   * gets paginated logEntries from backend. Clears current log entries. Add the new entries to the store, updates the count in the store.
   * @param query
   */
  findAllFromApiPaginated(query: QueryDto){
    this.logService.findAll(query).pipe(take(1), ).subscribe(paginatedLogEntries => {
  if(paginatedLogEntries){
    this.store.dispatch(new ClearLogEntryStore());
    this.store.dispatch(new UpdateLogEntryStore(paginatedLogEntries.data));
    this.store.dispatch(new UpdateLogEntryCount(paginatedLogEntries.count));
  }else {
    this.updateError('failed to load logs')
  }
}, error => {
      this.updateError('failed to get data');
    });
  }

  /**
   * gets the observable for the paginated logentries from the store.
   */
  getPaginatedLogEntries() : Observable<PaginationDto<LogEntryDto>>{
    return this.store.select<PaginationDto<LogEntryDto>>(logEntryState.paginatedLogEntries);
  }

  /**
   * get the logEntries observable from the store.
   */
  getLogEntries() : Observable<LogEntryDto[]>{
    return this.store.select<LogEntryDto[]>(logEntryState.logEntries);
  }

  /**
   * Removes a single logEntry from the store.
   * @param logEntry
   */
  removeLogEntry(logEntry: LogEntryDto){
    this.getCountObservable().pipe(take(1)).subscribe(count => {
      const newCount = count-1
      this.store.dispatch(new DeleteLogEntry(logEntry));
      this.store.dispatch(new UpdateLogEntryCount(newCount));
      this.logService.remove(logEntry.id).pipe(take(1)).subscribe( succes => {


        },
        error => {
          this.updateError(error);
          this.store.dispatch(new InsertOrUpdateLogEntry(logEntry));
          this.store.dispatch(new UpdateLogEntryCount(count))
        });
    })

    }

  /**
   * Updates the logEntry in the store if it exists.
   * @param updatedLogEntry
   */
  updateLogEntry(updatedLogEntry: LogEntryDto) {
    const l = this.store.selectOnce(logEntryState.logEntry(updatedLogEntry.id)).subscribe(orignalLogEntry => {
      if (orignalLogEntry) {
        this.store.dispatch(new InsertOrUpdateLogEntry(updatedLogEntry));
        this.logService.update({
          id: updatedLogEntry.id,
          error: updatedLogEntry.error,
          order: updatedLogEntry.order,
          timestamp: updatedLogEntry.timestamp,
          status: updatedLogEntry.status,
          process: updatedLogEntry.process
        }).pipe(take(1)).subscribe( succes => {}, error => {
          this.updateError(error);
          this.store.dispatch(new InsertOrUpdateLogEntry(orignalLogEntry));
        });
      } else {
        this.updateError('Could not find log to update');
      }

    }, error => {
      this.updateError(error);
    });

  }


  /**
   * Removes all logEntries from the store.
   */
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
  /**
   * get the logEntryState error observable from the store.
   */
  getErrorObservable(): Observable<any> {
    return this.store.select(logEntryState.errorSelector)
  }

  /**
   * clears the error from the store.
   */
  clearError(){
    this.store.dispatch(new ClearLogEntryError);
  }

  /**
   * updates the error in the store.
   * @param error
   */
  updateError(error: any){
    this.store.dispatch(new UpdateLogEntryError(error));
  }

  /**
   * gets the observable for the count.
   */
  getCountObservable(): Observable<number>{
    return this.store.select(logEntryState.count)
  }





}
