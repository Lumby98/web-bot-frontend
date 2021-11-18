import {UserDto} from "../models/user.dto";
import {Selector, State, Action, StateContext, createSelector} from "@ngxs/store";
import {Injectable} from "@angular/core";

import {
  ClearUserError,
  ClearUserStore, DeleteUser,
  InsertOrUpdateUser,
  UpdateUserError,
  UpdateUserStore
} from "./users.actions";
import {append, iif, insertItem, patch, removeItem, updateItem} from "@ngxs/store/operators";


export interface UsersStateModel{
  users: UserDto[];
  error: any;
}

@State<UsersStateModel>({
  name: 'user',
  defaults: {
    users: [],
    error: undefined
  }
})
@Injectable()
export class UserState {
  @Selector()
  static users(state: UsersStateModel): UserDto[] {
    return state.users;
  }

  /*@Selector()
  static usersSortedByUsername(state: UsersStateModel): UserDto[] {
    return state.users.sort((a, b) => {
      if (a.username < b.username) {
        return -1;
      }
      if (a.username > b.username) {
        return 1;
      }
      return 0
    });
  }*/

  static user(id: number): (state: UsersStateModel) => UserDto | undefined{
    return createSelector([UserState], (state: UsersStateModel) => {
      return state.users.find(user => user.id === id);
    });
  }

  @Selector()
  static errorSelector(state: UsersStateModel): any{
    return state.error;
  }

  @Action(UpdateUserStore)
  updateUserStore(ctx: StateContext<UsersStateModel>, action: UpdateUserStore): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state,
      users: action.users
    };
    ctx.setState(newState);
  }

  @Action(ClearUserStore)
  clearUserStore(ctx: StateContext<UsersStateModel>): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state, users: []
    };
    ctx.setState(newState);
  }

  @Action(InsertOrUpdateUser)
  insertOrUpdateUser(ctx: StateContext<UsersStateModel>, action: InsertOrUpdateUser): void {
  /*ctx.setState(patch({users: updateItem<UserDto>(user => user.id === action.user.id, action.user)}));
*/
    ctx.setState(patch({users: this.insertOrUpdateUserMethod(action.user.id,action.user)}));
  }


  @Action(DeleteUser)
  deleteUser(ctx: StateContext<UsersStateModel>, action: DeleteUser): void{
    const state = ctx.getState();
    if(state.users){
      ctx.setState(patch({
        users: removeItem<UserDto>(user => user?.id === action.user.id)
      }))
    }

  }

  @Action(UpdateUserError)
  updateError(ctx: StateContext<UsersStateModel>, action: UpdateUserError): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

  @Action(ClearUserError)
  clearError(ctx: StateContext<UsersStateModel>): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state,
      error: undefined
    };
    ctx.setState(newState);
  }

  insertOrUpdateUserMethod(id: number, loadedUser: UserDto) {
    return iif<UserDto[]>(
      (users => {
         if(users != undefined){
         return  users.some(user => user.id === id);
        }
         return false;
      }),
      updateItem(user => user?.id === id, patch(loadedUser)),
      insertItem(loadedUser)
    );


  }

}
