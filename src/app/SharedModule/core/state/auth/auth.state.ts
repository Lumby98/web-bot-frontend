import {Action, State, Selector, StateContext} from '@ngxs/store';
import {Injectable} from "@angular/core";
import {ClearError, UpdateError} from "./auth.actions";

export interface AuthStateModel{
  error: any;
}

@State<AuthStateModel>({
  name: 'auth',
  defaults: {
  error: undefined
  }
})

@Injectable()
export class AuthState{
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

  @Action(UpdateError)
  updateError(ctx: StateContext<AuthStateModel>, action: UpdateError): void {
    const state = ctx.getState();
    const newState: AuthStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

}
