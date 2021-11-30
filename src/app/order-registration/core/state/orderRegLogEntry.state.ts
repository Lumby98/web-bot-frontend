import {Action, createSelector, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {iif, insertItem, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {LogEntryDto} from "../../../SharedModule/core/models/LogEntry.dto";
import {ProcessStepDto} from "../models/processStep.dto";
import {
  ClearOrderRegLogEntryError,
  ClearOrderRegLogEntryStore,
  DeleteOrderRegLogEntry,
  InsertOrUpdateOrderRegLogEntry,
  UpdateOrderRegLogEntryError,
  UpdateOrderRegLogEntryStore,
  UpdateProcessStep
} from "./orderReglogEntry.actions";
import {ProcessStepEnum} from "../enums/processStep.enum";


export interface OrderRegLogEntryStateModel {
  orderRegLogEntries: LogEntryDto[];
  getOrderInfo: ProcessStepDto | undefined;
  getOrder: ProcessStepDto | undefined;
  allocateOrder: ProcessStepDto | undefined;
  error: any;
}

@State<OrderRegLogEntryStateModel>({
  name: 'orderRegLogEntry',
  defaults: {
    orderRegLogEntries: [],
    error: undefined,
    getOrderInfo: undefined,
    getOrder: undefined,
    allocateOrder: undefined,
  }
})
@Injectable()
export class orderRegLogEntryState {
  @Selector()
  static orderRegLogEntries(state: OrderRegLogEntryStateModel): LogEntryDto[] {
    return state.orderRegLogEntries;
  }

  static OrderRegLogEntry(id: number): (state: OrderRegLogEntryStateModel) => LogEntryDto | undefined{
    return createSelector([orderRegLogEntryState], (state: OrderRegLogEntryStateModel) => {
      return state.orderRegLogEntries.find(logEntry => logEntry.id === id);
    });
  }

  @Selector()
  static errorSelector(state: OrderRegLogEntryStateModel): any{
    return state.error;
  }

  @Action(UpdateOrderRegLogEntryStore)
  updateOrderRegLogEntryStore(ctx: StateContext<OrderRegLogEntryStateModel>, action: UpdateOrderRegLogEntryStore): void {
    const state = ctx.getState();
    const newState: OrderRegLogEntryStateModel = {
      ...state,
      orderRegLogEntries: action.logEntries
    };
    ctx.setState(newState);
  }

  @Action(ClearOrderRegLogEntryStore)
  clearOrderRegLogEntryStore(ctx: StateContext<OrderRegLogEntryStateModel>): void {
    const state = ctx.getState();
    const newState: OrderRegLogEntryStateModel = {
      ...state, orderRegLogEntries: []
    };
    ctx.setState(newState);
  }

  @Action(InsertOrUpdateOrderRegLogEntry)
  insertOrUpdateOrderRegLogEntry(ctx: StateContext<OrderRegLogEntryStateModel>, action: InsertOrUpdateOrderRegLogEntry): void {
    /*ctx.setState(patch({users: updateItem<UserDto>(user => user.id === action.user.id, action.user)}));
  */
    ctx.setState(patch({orderRegLogEntries: this.insertOrUpdateOrderRegLogEntryMethod(action.logEntry.id,action.logEntry)}));
  }


  @Action(DeleteOrderRegLogEntry)
  deleteOrderRegLogEntry(ctx: StateContext<OrderRegLogEntryStateModel>, action: DeleteOrderRegLogEntry): void{
    const state = ctx.getState();
    if(state.orderRegLogEntries){
      ctx.setState(patch({
        orderRegLogEntries: removeItem<LogEntryDto>(user => user?.id === action.logEntry.id)
      }))
    }

  }

  @Action(UpdateOrderRegLogEntryError)
  updateOrderRegLogEntryError(ctx: StateContext<OrderRegLogEntryStateModel>, action: UpdateOrderRegLogEntryError): void {
    const state = ctx.getState();
    const newState: OrderRegLogEntryStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

  @Action(ClearOrderRegLogEntryError)
  clearOrderRegLogEntryError(ctx: StateContext<OrderRegLogEntryStateModel>): void {
    const state = ctx.getState();
    const newState: OrderRegLogEntryStateModel = {
      ...state,
      error: undefined
    };
    ctx.setState(newState);
  }

  @Action(UpdateProcessStep)
  updateProcessStep(ctx: StateContext<OrderRegLogEntryStateModel>, action: UpdateProcessStep){
    const state = ctx.getState();
    let newState: OrderRegLogEntryStateModel;

    switch(action.processStepDto.processStep) {
      case ProcessStepEnum.GETORDERINFO:
         newState = {
          ...state,
          getOrderInfo: action.processStepDto
        };
        break;
      case  ProcessStepEnum.GETORDER:
        newState = {
          ...state,
          getOrder: action.processStepDto
        };
        break;

      case  ProcessStepEnum.ALOCATEORDER:
        newState = {
          ...state,
          allocateOrder: action.processStepDto
        };
        break;
    }


    ctx.setState(newState);

  }

  insertOrUpdateOrderRegLogEntryMethod(id: number, loadedLogEntry: LogEntryDto) {
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
