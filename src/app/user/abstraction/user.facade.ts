import {Injectable} from "@angular/core";
import {AuthService} from "../../SharedModule/core/services/auth.service";
import {Store} from "@ngxs/store";
import {Router} from "@angular/router";
import {UserService} from "../core/services/user.service";
import {RegisterDto} from "../core/models/register.dto";
import {ClearUserError, UpdateUserError} from "../core/state/users.actions";
import {AuthState} from "../../SharedModule/core/state/auth/auth.state";
import {ClearError} from "../../SharedModule/core/state/auth/auth.actions";
import {UserState} from "../core/state/users.state";

@Injectable()
export class UserFacade {
  constructor(private userService: UserService,private auth: AuthService, private store: Store, private router: Router) {
  }

  register(dto: RegisterDto) {
    this.auth.register(dto).subscribe(succes => {
      this.router.navigate(['/user-list']);
      this.store.dispatch(new ClearUserError());
    }, err => {
      this.store.dispatch(new UpdateUserError(err));
    });
  }



  getError(): any {
    return this.store.selectOnce(UserState.errorSelector);
  }

  clearError(){
    this.store.dispatch(new ClearUserError());
  }

  updateError(error: any){
    this.store.dispatch(new UpdateUserError(error));
  }


}
