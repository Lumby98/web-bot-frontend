import {UserDto} from "../models/user.dto";
import {Selector, State, Action, StateContext} from "@ngxs/store";
import {Injectable} from "@angular/core";
import {UpdateError} from "../../../SharedModule/core/state/auth/auth.actions";
import {AddUser, ClearUserStore, UpdateUser, UpdateUserError, UpdateUserStore} from "./users.actions";
import {append, iif, insertItem, patch, updateItem} from "@ngxs/store/operators";

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
  static Users(state: UsersStateModel): UserDto[] {
    return state.users;
  }

  @Selector()
  static ErrorSelector(state: UsersStateModel): any{
    return state.error;
  }

  @Action(UpdateUserStore)
  UpdateUserStore(ctx: StateContext<UsersStateModel>, action: UpdateUserStore): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state,
      users: action.users
    };
    ctx.setState(newState);
  }

  @Action(ClearUserStore)
  ClearUserStore(ctx: StateContext<UsersStateModel>): void {
    const state = ctx.getState();
    const newState: UsersStateModel = {
      ...state, users: []
    };
    ctx.setState(newState);
  }

  @Action(AddUser)
  AddUser(ctx: StateContext<UsersStateModel>, action: AddUser): void {
    ctx.setState(patch({users: insertItem(action.user)}));
  }

  @Action(UpdateUser)
  UpdateUser(ctx: StateContext<UsersStateModel>, action: UpdateUser): void {
    ctx.setState(patch({users: updateItem<UserDto>(user => user.id === action.user.id, action.user)}));
  }

  insertOrUpdateUser(id: number, loadedUser?: UserDto) {
    return iif<UserDto[]>(
      (loadedUser != null && (contracts => contracts.some(contract => contract.id === id))),
      updateItem(contract => contract.id === id, patch(loadedUser)),
      insertItem(loadedUser)
    );
  }

}
