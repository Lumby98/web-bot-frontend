import {UserDto} from "../models/user.dto";
import {EditUserDto} from "../models/edit-user.dto";

export class UpdateUserStore{

  constructor(public users: UserDto[]) {}
    static readonly type = '[user] Update users'

}

export class AddUser{

  constructor(public users: UserDto) {}
  static readonly type = '[user] add user'

}


export class UpdateUser{

  constructor(public users: EditUserDto) {}
  static readonly type = '[user] update user'

}

export class DeleteUser{

  constructor(public users: UserDto) {}
  static readonly type = '[user] delete user'

}

export class ClearUserError{
  static readonly type = '[error] clear user error';
}

export class UpdateUserError{
  constructor(public error: any) {}

  static readonly type = '[error] Update user error';
}

