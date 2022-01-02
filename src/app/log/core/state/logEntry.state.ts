import {LogEntryDto} from "../../presentation/dto/log-entry.dto";
import {Action, createSelector, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {iif, insertItem, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {
  ClearLogEntryError,
  ClearLogEntryStore,
  DeleteLogEntry,
  InsertOrUpdateLogEntry, UpdateLogEntryCount,
  UpdateLogEntryError,
  UpdateLogEntryStore
} from "./logEntry.actions";
import {PaginationDto} from "../../../SharedModule/presentation/dto/filter/pagination-dto";

/**
 * model for logEntry sate
 */
export interface LogEntryStateModel {
  logEntries: LogEntryDto[];
  count: number;
  error: any;
}

@State<LogEntryStateModel>({
  name: 'logEntry',
  defaults: {
    logEntries: [],
    error: undefined,
    count: 0,

  }
})
@Injectable()
export class logEntryState{
  /**
   * selects logEntries from the store.
   * @param state
   */
  @Selector()
  static logEntries(state: LogEntryStateModel): LogEntryDto[] {
    return state.logEntries;
  }

  /**
   * selects paginated logEntries from the store
   * @param state
   */
  @Selector()
  static paginatedLogEntries(state: LogEntryStateModel): PaginationDto<LogEntryDto>  {
    return {count: state.count, data: state.logEntries};
  }

  /**
   * selects a specific logEntry from the store based on id.
   * @param id
   */
  static logEntry(id: number): (state: LogEntryStateModel) => LogEntryDto | undefined{
    return createSelector([logEntryState], (state: LogEntryStateModel) => {
      return state.logEntries.find(logEntry => logEntry.id === id);
    });
  }

  /**
   * selects the error from the store
   * @param state
   */
  @Selector()
  static errorSelector(state: LogEntryStateModel): any{
    return state.error;
  }

  /**
   * selects the count from the store
   * @param state
   */
  @Selector()
  static count(state: LogEntryStateModel): any{
    return state.count;
  }

  /**
   * updates the logEntry count in the store with a new count
   * @param ctx
   * @param action
   */
  @Action(UpdateLogEntryCount)
  updateLogEntryCount(ctx: StateContext<LogEntryStateModel>, action: UpdateLogEntryCount): void {
    const state = ctx.getState();
    const newState: LogEntryStateModel = {
      ...state,
      count: action.count
    };
    ctx.setState(newState);
  }

  /**
   * updates the logEntries in the store with a new list of logEntries
   * @param ctx
   * @param action
   */
  @Action(UpdateLogEntryStore)
  updateLogEntryStore(ctx: StateContext<LogEntryStateModel>, action: UpdateLogEntryStore): void {
    const state = ctx.getState();
    const newState: LogEntryStateModel = {
      ...state,
      logEntries: action.logEntries
    };
    ctx.setState(newState);
  }

  /**
   * clears all the logEntries in the store and sets the count to zero
   * @param ctx
   */
  @Action(ClearLogEntryStore)
  clearLogEntryStore(ctx: StateContext<LogEntryStateModel>): void {
    const state = ctx.getState();
    const newState: LogEntryStateModel = {
      ...state, logEntries: [], count: 0,
    };
    ctx.setState(newState);
  }

  /**
   * inserts or updates a logEntry
   * @param ctx
   * @param action
   */
  @Action(InsertOrUpdateLogEntry)
  insertOrUpdateLogEntry(ctx: StateContext<LogEntryStateModel>, action: InsertOrUpdateLogEntry): void {
    ctx.setState(patch({logEntries: this.insertOrUpdateLogEntryMethod(action.logEntry.id,action.logEntry)}));
  }

  /**
   * deletes a logEntry from the store
   * @param ctx
   * @param action
   */
  @Action(DeleteLogEntry)
  deleteLogEntry(ctx: StateContext<LogEntryStateModel>, action: DeleteLogEntry): void{
    const state = ctx.getState();
    if(state.logEntries){
      ctx.setState(patch({
        logEntries: removeItem<LogEntryDto>(user => user?.id === action.logEntry.id)
      }))
    }

  }

  /**
   * updates logEntry error
   * @param ctx
   * @param action
   */
  @Action(UpdateLogEntryError)
  updateLogEntryError(ctx: StateContext<LogEntryStateModel>, action: UpdateLogEntryError): void {
    const state = ctx.getState();
    const newState: LogEntryStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

  /**
   * clears logEntry error
   * @param ctx
   */
  @Action(ClearLogEntryError)
  clearLogEntryError(ctx: StateContext<LogEntryStateModel>): void {
    const state = ctx.getState();
    const newState: LogEntryStateModel = {
      ...state,
      error: undefined
    };
    ctx.setState(newState);
  }

  /**
   * inserts or updates the logEntry. Based on whether or not it already exists in the store.
   * @param id
   * @param loadedLogEntry
   */
  insertOrUpdateLogEntryMethod(id: number, loadedLogEntry: LogEntryDto) {
    return iif<LogEntryDto[]>(
      (logEntries => {
        if(logEntries != undefined){
          return  logEntries.some(logEntry => logEntry.id === id);
        }
        return false;
      }),
      updateItem(logEntry => logEntry?.id === id, patch(loadedLogEntry)),
      insertItem(loadedLogEntry)
    );


  }
}
