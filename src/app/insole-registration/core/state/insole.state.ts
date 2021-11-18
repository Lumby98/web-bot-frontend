import {Action, State, Selector, StateContext} from '@ngxs/store';
import {Injectable} from "@angular/core";
import {ClearInsoleError, UpdateInsoleError} from "./insole.actions";

export interface InsoleStateModel{
  error: any;
}

@State<InsoleStateModel>({
  name: 'insole',
  defaults: {
    error: undefined
  }
})

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

  @Selector()
  static error(state: InsoleStateModel): any {
    return state.error;
  }

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
