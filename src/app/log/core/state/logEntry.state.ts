import {LogEntryDto} from "../../presentation/dto/log-entry.dto";
import {Action, createSelector, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {iif, insertItem, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {
  ClearLogEntryError,
  ClearLogEntryStore,
  DeleteLogEntry,
  InsertOrUpdateLogEntry,
  UpdateLogEntryError,
  UpdateLogEntryStore
} from "./logEntry.actions";

export interface LogEntryStateModel {
  logEntries: LogEntryDto[];
  error: any;
}

@State<LogEntryStateModel>({
  name: 'logEntry',
  defaults: {
    logEntries: [],
    error: undefined,

  }
})
@Injectable()
export class logEntryState{
  @Selector()
  static orderRegLogEntries(state: LogEntryStateModel): LogEntryDto[] {
    return state.logEntries;
  }

  static OrderRegLogEntry(id: number): (state: LogEntryStateModel) => LogEntryDto | undefined{
    return createSelector([logEntryState], (state: LogEntryStateModel) => {
      return state.logEntries.find(logEntry => logEntry.id === id);
    });
  }

  @Selector()
  static errorSelector(state: LogEntryStateModel): any{
    return state.error;
  }

  @Action(UpdateLogEntryStore)
  updateLogEntryStore(ctx: StateContext<LogEntryStateModel>, action: UpdateLogEntryStore): void {
    const state = ctx.getState();
    const newState: LogEntryStateModel = {
      ...state,
      logEntries: action.logEntries
    };
    ctx.setState(newState);
  }

  @Action(ClearLogEntryStore)
  clearLogEntryStore(ctx: StateContext<LogEntryStateModel>): void {
    const state = ctx.getState();
    const newState: LogEntryStateModel = {
      ...state, logEntries: []
    };
    ctx.setState(newState);
  }

  @Action(InsertOrUpdateLogEntry)
  insertOrUpdateLogEntry(ctx: StateContext<LogEntryStateModel>, action: InsertOrUpdateLogEntry): void {
    /*ctx.setState(patch({users: updateItem<UserDto>(user => user.id === action.user.id, action.user)}));
  */
    ctx.setState(patch({logEntries: this.insertOrUpdateLogEntryMethod(action.logEntry.id,action.logEntry)}));
  }


  @Action(DeleteLogEntry)
  deleteLogEntry(ctx: StateContext<LogEntryStateModel>, action: DeleteLogEntry): void{
    const state = ctx.getState();
    if(state.logEntries){
      ctx.setState(patch({
        logEntries: removeItem<LogEntryDto>(user => user?.id === action.logEntry.id)
      }))
    }

  }

  @Action(UpdateLogEntryError)
  updateLogEntryError(ctx: StateContext<LogEntryStateModel>, action: UpdateLogEntryError): void {
    const state = ctx.getState();
    const newState: LogEntryStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

  @Action(ClearLogEntryError)
  clearLogEntryError(ctx: StateContext<LogEntryStateModel>): void {
    const state = ctx.getState();
    const newState: LogEntryStateModel = {
      ...state,
      error: undefined
    };
    ctx.setState(newState);
  }
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
