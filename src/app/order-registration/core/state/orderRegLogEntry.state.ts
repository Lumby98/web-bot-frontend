import {Action, createSelector, Selector, State, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {iif, insertItem, patch, removeItem, updateItem} from "@ngxs/store/operators";
import {ProcessStepDto} from "../models/processStep.dto";
import {
  ClearOrderRegLogEntryError,
  ClearOrderRegLogEntryStore, ClearProcessSteps,
  DeleteOrderRegLogEntry,
  InsertOrUpdateOrderRegLogEntry,
  UpdateOrderRegLogEntryError,
  UpdateOrderRegLogEntryStore,
  UpdateProcessStep
} from "./orderReglogEntry.actions";
import {ProcessStepEnum} from "../enums/processStep.enum";
import {LogEntryDto} from "../../../log/presentation/dto/log-entry.dto";


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

  /**
   * gets an order registration log entry from the given id
   * @param id
   * @constructor
   */
  static OrderRegLogEntry(id: number): (state: OrderRegLogEntryStateModel) => LogEntryDto | undefined{
    return createSelector([orderRegLogEntryState], (state: OrderRegLogEntryStateModel) => {
      return state.orderRegLogEntries.find(logEntry => logEntry.id === id);
    });
  }

  @Selector()
  static errorSelector(state: OrderRegLogEntryStateModel): any{
    return state.error;
  }


  /**
   * gets a process step from the given enumerator
   * @param type
   */
  static processStep(type: ProcessStepEnum): (state: OrderRegLogEntryStateModel) => ProcessStepDto | undefined{
    return createSelector([orderRegLogEntryState], (state: OrderRegLogEntryStateModel) => {
      switch(type) {
        case ProcessStepEnum.GETORDERINFO:
          return state.getOrderInfo;
          break;

        case  ProcessStepEnum.REGISTERORDER:
          return state.getOrder;
          break;

        case  ProcessStepEnum.ALOCATEORDER:
          return state.allocateOrder;
          break;
      }
    });
  }

  /**
   * this action calls the update order registration log entry store method
   * @param ctx
   * @param action
   */
  @Action(UpdateOrderRegLogEntryStore)
  updateOrderRegLogEntryStore(ctx: StateContext<OrderRegLogEntryStateModel>, action: UpdateOrderRegLogEntryStore): void {
    const state = ctx.getState();
    const newState: OrderRegLogEntryStateModel = {
      ...state,
      orderRegLogEntries: action.logEntries
    };
    ctx.setState(newState);
  }

  /**
   * this action calls the clear order registration log entry store method
   * @param ctx
   */
  @Action(ClearOrderRegLogEntryStore)
  clearOrderRegLogEntryStore(ctx: StateContext<OrderRegLogEntryStateModel>): void {
    const state = ctx.getState();
    const newState: OrderRegLogEntryStateModel = {
      ...state, orderRegLogEntries: []
    };
    ctx.setState(newState);
  }

  /**
   * this action calls the insert or update order registration log entry store method
   * @param ctx
   * @param action
   */
  @Action(InsertOrUpdateOrderRegLogEntry)
  insertOrUpdateOrderRegLogEntry(ctx: StateContext<OrderRegLogEntryStateModel>, action: InsertOrUpdateOrderRegLogEntry): void {
    ctx.setState(patch({orderRegLogEntries: this.insertOrUpdateOrderRegLogEntryMethod(action.logEntry.id,action.logEntry)}));
  }

  /**
   * this action calls the delete order registration log entry store method
   * @param ctx
   * @param action
   */
  @Action(DeleteOrderRegLogEntry)
  deleteOrderRegLogEntry(ctx: StateContext<OrderRegLogEntryStateModel>, action: DeleteOrderRegLogEntry): void{
    const state = ctx.getState();
    if(state.orderRegLogEntries){
      ctx.setState(patch({
        orderRegLogEntries: removeItem<LogEntryDto>(user => user?.id === action.logEntry.id)
      }))
    }

  }

  /**
   * this action calls the update order registration log entry error method
   * @param ctx
   * @param action
   */
  @Action(UpdateOrderRegLogEntryError)
  updateOrderRegLogEntryError(ctx: StateContext<OrderRegLogEntryStateModel>, action: UpdateOrderRegLogEntryError): void {
    const state = ctx.getState();
    const newState: OrderRegLogEntryStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

  /**
   * this action calls the clear order registration log entry error method
   * @param ctx
   */
  @Action(ClearOrderRegLogEntryError)
  clearOrderRegLogEntryError(ctx: StateContext<OrderRegLogEntryStateModel>): void {
    const state = ctx.getState();
    const newState: OrderRegLogEntryStateModel = {
      ...state,
      error: undefined
    };
    ctx.setState(newState);
  }

  /**
   * this action calls the clear process steps method
   * @param ctx
   */
  @Action(ClearProcessSteps)
  clearProcessSteps(ctx: StateContext<OrderRegLogEntryStateModel>){
    const state = ctx.getState();
    const newState: OrderRegLogEntryStateModel = {
      ...state,
      getOrderInfo: undefined,
      getOrder: undefined,
      allocateOrder: undefined
    };
    ctx.setState(newState);
  }

  /**
   * this action calls the update process steps method
   * @param ctx
   * @param action
   */
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
      case  ProcessStepEnum.REGISTERORDER:
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

  /**
   * inserts the given order registration log entry or updates it if it already exists
   * @param id
   * @param loadedLogEntry
   */
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
