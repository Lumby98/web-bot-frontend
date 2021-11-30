import {Selector, State, Action, StateContext, createSelector} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {append, iif, insertItem, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {LogEntryDto} from "../../../SharedModule/core/models/LogEntry.dto";
import {ProcessStepDto} from "../models/processStep.dto";
import {
  ClearOrderRegLogEntryError,
  ClearOrderRegLogEntryStore,
  DeleteOrderRegLogEntry,
  InsertOrUpdateOrderRegLogEntry,
  UpdateOrderRegLogEntryError,
  UpdateOrderRegLogEntryStore
} from "./logEntry.actions";


export interface logEntryStateModel{
  logEntries: LogEntryDto[];
  getOrderinfo: ProcessStepDto | undefined;
  getOrder: ProcessStepDto | undefined;
  allocateOrder: ProcessStepDto | undefined;
  error: any;
}

@State<logEntryStateModel>({
  name: 'user',
  defaults: {
    logEntries: [],
    error: undefined,
    getOrderinfo: undefined,
    getOrder: undefined,
    allocateOrder: undefined,
  }
})
@Injectable()
export class logEntryState {
  @Selector()
  static logEntries(state: logEntryStateModel): LogEntryDto[] {
    return state.logEntries;
  }

  static logEntry(id: number): (state: logEntryStateModel) => LogEntryDto | undefined{
    return createSelector([logEntryState], (state: logEntryStateModel) => {
      return state.logEntries.find(logEntry => logEntry.id === id);
    });
  }

  @Selector()
  static errorSelector(state: logEntryStateModel): any{
    return state.error;
  }

  @Action(UpdateOrderRegLogEntryStore)
  updateLogEntryStore(ctx: StateContext<logEntryStateModel>, action: UpdateOrderRegLogEntryStore): void {
    const state = ctx.getState();
    const newState: logEntryStateModel = {
      ...state,
      logEntries: action.logEntries
    };
    ctx.setState(newState);
  }

  @Action(ClearOrderRegLogEntryStore)
  clearLogEntryStore(ctx: StateContext<logEntryStateModel>): void {
    const state = ctx.getState();
    const newState: logEntryStateModel = {
      ...state, logEntries: []
    };
    ctx.setState(newState);
  }

  @Action(InsertOrUpdateOrderRegLogEntry)
  insertOrUpdateLogEntry(ctx: StateContext<logEntryStateModel>, action: InsertOrUpdateOrderRegLogEntry): void {
    /*ctx.setState(patch({users: updateItem<UserDto>(user => user.id === action.user.id, action.user)}));
  */
    ctx.setState(patch({logEntries: this.insertOrUpdateLogEntryMethod(action.logEntry.id,action.logEntry)}));
  }


  @Action(DeleteOrderRegLogEntry)
  deleteLogEntry(ctx: StateContext<logEntryStateModel>, action: DeleteOrderRegLogEntry): void{
    const state = ctx.getState();
    if(state.logEntries){
      ctx.setState(patch({
        logEntries: removeItem<LogEntryDto>(user => user?.id === action.logEntry.id)
      }))
    }

  }

  @Action(UpdateOrderRegLogEntryError)
  updateLogEntryError(ctx: StateContext<logEntryStateModel>, action: UpdateOrderRegLogEntryError): void {
    const state = ctx.getState();
    const newState: logEntryStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

  @Action(ClearOrderRegLogEntryError)
  clearLogEntryError(ctx: StateContext<logEntryStateModel>): void {
    const state = ctx.getState();
    const newState: logEntryStateModel = {
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
