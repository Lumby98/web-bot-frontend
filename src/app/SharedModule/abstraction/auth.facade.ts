import {Injectable} from "@angular/core";
import {AuthService} from "../core/services/auth.service";
import {UserDto} from "../../user/core/models/user.dto";
import {take} from "rxjs/operators";
import {Store} from "@ngxs/store";
import {ClearError, UpdateError} from "../core/state/auth/auth.actions";
import {AuthState} from "../core/state/auth/auth.state";
import {LoginDto} from "../core/models/login.dto";
import {Router} from "@angular/router";

@Injectable()
export class AuthFacade{
  constructor(private auth: AuthService,private store: Store, private router: Router) {
  }

  getLocalUser() : UserDto | undefined{
    return this.auth.GetCurrentUserFromLocalStorage()
  }

  login(dto: LoginDto){

    this.auth.login(dto).subscribe(succes => {
      this.router.navigateByUrl('/home');
      this.store.dispatch(new ClearError());
    }, err => {
      this.store.dispatch(new UpdateError(err));
    });
  }

  logOut(){
    this.auth.logout().pipe(take(1)).subscribe(() => {
      this.store.dispatch(new ClearError());
    }, err => {
      this.store.dispatch(new UpdateError(err));
    });
  }

  getError(): any {
    return this.store.selectOnce(AuthState.error);
  }

  clearError(){
    this.store.dispatch(new ClearError());
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }

}
