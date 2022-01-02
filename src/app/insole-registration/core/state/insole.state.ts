import {Action, State, Selector, StateContext} from '@ngxs/store';
import {Injectable} from "@angular/core";
import {ClearInsoleError, UpdateInsoleError} from "./insole.actions";

/**
 * model for the insole state.
 */
export interface InsoleStateModel{
  error: any;
}

/**
 * model for the insole state
 */
@State<InsoleStateModel>({
  name: 'insole',
  defaults: {
    error: undefined
  }
})
/**
 *class that defines the state
 */
@Injectable()
export class InsoleState{
  @Action(ClearInsoleError)
  clearError(ctx: StateContext<InsoleStateModel>): void {
    const state = ctx.getState();
    const newState: InsoleStateModel = {
      ...state,
      error: undefined
    };
    ctx.setState(newState);
  }

  /**
   * selector for insoleState error.
   * @param state
   */
  @Selector()
  static error(state: InsoleStateModel): any {
    return state.error;
  }

  /**
   * replaces the current error in the store with a new one.
   * @param ctx
   * @param action
   */
  @Action(UpdateInsoleError)
  updateError(ctx: StateContext<InsoleStateModel>, action: UpdateInsoleError): void {
    const state = ctx.getState();
    const newState: InsoleStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

}
