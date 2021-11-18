import {Action, State, Selector, StateContext} from '@ngxs/store';
import {Injectable} from "@angular/core";
import {ClearScraperError, UpdateScraperError} from "./scraper.actions";

export interface ScraperStateModel{
  error: any;
}

@State<ScraperStateModel>({
  name: 'scraper',
  defaults: {
    error: undefined
  }
})

@Injectable()
export class ScraperState{
  @Action(ClearScraperError)
  clearError(ctx: StateContext<ScraperStateModel>): void {
    const state = ctx.getState();
    const newState: ScraperStateModel = {
      ...state,
      error: undefined
    };
    ctx.setState(newState);
  }

  @Selector()
  static error(state: ScraperStateModel): any {
    return state.error;
  }

  @Action(UpdateScraperError)
  updateError(ctx: StateContext<ScraperStateModel>, action: UpdateScraperError): void {
    const state = ctx.getState();
    const newState: ScraperStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

}
