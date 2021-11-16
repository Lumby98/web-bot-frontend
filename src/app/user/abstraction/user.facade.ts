import {Injectable} from "@angular/core";
import {AuthService} from "../../SharedModule/core/services/auth.service";
import {Store} from "@ngxs/store";
import {Router} from "@angular/router";
import {UserService} from "../core/services/user.service";
import {RegisterDto} from "../core/models/register.dto";
import {ClearUserError, InsertOrUpdateUser, UpdateUserError} from "../core/state/users.actions";
import {UserState} from "../core/state/users.state";
import {take} from "rxjs/operators";
import {Observable} from "rxjs";
import {UserDto} from "../core/models/user.dto";

@Injectable()
export class UserFacade {
  constructor(private userService: UserService,private auth: AuthService, private store: Store, private router: Router) {
  }

  register(dto: RegisterDto) {
    this.auth.register(dto).subscribe(success => {
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

  getUserByIdFromApi(id: number){
    this.userService.userById(id).pipe(take(1)).subscribe(u => {
      if (u) {
        this.store.dispatch(new InsertOrUpdateUser(u));
      } else {
        throw new Error('failed to find user')
      }
  })
}

  getUserById(id: number): Observable<UserDto | undefined> {
    return this.store.select(UserState.user(id))
  }
}
