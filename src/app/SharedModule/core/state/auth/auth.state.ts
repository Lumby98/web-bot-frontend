import {Action, State, Selector, StateContext} from '@ngxs/store';
import {Injectable} from "@angular/core";
import {ClearError, ClearKey, UpdateError, UpdateKey} from "./auth.actions";

export interface AuthStateModel{
  error: any;
  key: string;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
  error: undefined,
    key: "",

  }
})

@Injectable()
export class AuthState{

  /**
   * this action calls the clear error method
   * @param ctx
   */
  @Action(ClearError)
  clearError(ctx: StateContext<AuthStateModel>): void {
    const state = ctx.getState();
    const newState: AuthStateModel = {
      ...state,
      error: undefined
    };
    ctx.setState(newState);
  }

  @Selector()
  static error(state: AuthStateModel): any {
    return state.error;
  }

  /**
   * this action calls the update error method
   * @param ctx
   * @param action
   */
  @Action(UpdateError)
  updateError(ctx: StateContext<AuthStateModel>, action: UpdateError): void {
    const state = ctx.getState();
    const newState: AuthStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

  /**
   * this action calls the clear key method
   * @param ctx
   */
  @Action(ClearKey)
  clearKey(ctx: StateContext<AuthStateModel>): void {
    const state = ctx.getState();
    const newState: AuthStateModel = {
      ...state,
      key: ""
    };
    ctx.setState(newState);
  }

  @Selector()
  static key(state: AuthStateModel): any {
    return state.key;
  }

  /**
   * this action calls the update key method
   * @param ctx
   * @param action
   */
  @Action(UpdateKey)
  updateKey(ctx: StateContext<AuthStateModel>, action: UpdateKey): void {
    const state = ctx.getState();
    const newState: AuthStateModel = {
      ...state,
      key: action.key
    };
    ctx.setState(newState);
  }

}
