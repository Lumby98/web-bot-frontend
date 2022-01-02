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
import {iif, insertItem, patch, removeItem, updateItem} from "@ngxs/store/operators";


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
  /**
   * gets all users
   * @param state
   */
  @Selector()
  static users(state: UsersStateModel): UserDto[] {
    return state.users;
  }

  /**
   * gets users by id
   * @param id
   */
  static user(id: number): (state: UsersStateModel) => UserDto | undefined{
    return createSelector([UserState], (state: UsersStateModel) => {
      return state.users.find(user => user.id === id);
    });
  }

  /**
   * returns an error, needs to know error state to return error
   * @param state
   */
  @Selector()
  static errorSelector(state: UsersStateModel): any{
    return state.error;
  }

  /**
   * this action calls the update user store error method
   * @param ctx
   * @param action
   */
  @Action(UpdateUserStore)
  updateUserStore(ctx: StateContext<UsersStateModel>, action: UpdateUserStore): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state,
      users: action.users
    };
    ctx.setState(newState);
  }

  /**
   * this action calls the clear user store method
   * @param ctx
   */
  @Action(ClearUserStore)
  clearUserStore(ctx: StateContext<UsersStateModel>): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state, users: []
    };
    ctx.setState(newState);
  }

  /**
   * this action calls the insert or update user method
   * @param ctx
   * @param action
   */
  @Action(InsertOrUpdateUser)
  insertOrUpdateUser(ctx: StateContext<UsersStateModel>, action: InsertOrUpdateUser): void {
  /*ctx.setState(patch({users: updateItem<UserDto>(user => user.id === action.user.id, action.user)}));
*/
    ctx.setState(patch({users: this.insertOrUpdateUserMethod(action.user.id,action.user)}));
  }

  /**
   * this action calls the delete user method
   * @param ctx
   * @param action
   */
  @Action(DeleteUser)
  deleteUser(ctx: StateContext<UsersStateModel>, action: DeleteUser): void{
    const state = ctx.getState();
    if(state.users){
      ctx.setState(patch({
        users: removeItem<UserDto>(user => user?.id === action.user.id)
      }))
    }

  }

  /**
   * this action calls the update user error method
   * @param ctx
   * @param action
   */
  @Action(UpdateUserError)
  updateError(ctx: StateContext<UsersStateModel>, action: UpdateUserError): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state,
      error: action.error
    };
    ctx.setState(newState);
  }

  /**
   * this action calls the clear user error method
   * @param ctx
   */
  @Action(ClearUserError)
  clearError(ctx: StateContext<UsersStateModel>): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state,
      error: undefined
    };
    ctx.setState(newState);
  }

  /**
   * inserts a user, updates it with given info, if it already exists
   * @param id
   * @param loadedUser
   */
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
