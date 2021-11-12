import {Injectable} from "@angular/core";
import {AuthService} from "../core/services/auth.service";
import {UserDto} from "../dto/user.dto";

@Injectable()
export class AuthFacade{
  constructor(private auth: AuthService,) {
  }

  getLocalUser() : UserDto | null{
    return this.auth.GetCurrentUserFromLocalStorage()
  }

}
