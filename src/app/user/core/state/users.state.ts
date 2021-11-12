import {UserDto} from "../models/user.dto";
import {State} from "@ngxs/store";
import {Injectable} from "@angular/core";

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
  
}
