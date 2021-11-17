import {Injectable} from "@angular/core";
import {AuthService} from "../../SharedModule/core/services/auth.service";
import {Store} from "@ngxs/store";
import {Router} from "@angular/router";
import {UserService} from "../core/services/user.service";
import {RegisterDto} from "../core/models/register.dto";
import {
  ClearUserError,
  ClearUserStore,
  DeleteUser,
  InsertOrUpdateUser,
  UpdateUserError, UpdateUserStore
} from "../core/state/users.actions";
import {UserState} from "../core/state/users.state";
import {map, take, tap} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";
import {UserDto} from "../core/models/user.dto";
import {EditUserDto} from "../core/models/edit-user.dto";

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

  getUserByIdFromApi(id: number) : Observable<UserDto>{
    return this.userService.userById(id).pipe(tap(u => {
      if (u) {
        this.store.dispatch(new InsertOrUpdateUser(u));
      } else {
        //Might break
        this.updateError(Error('failed to find user'));

        throw new Error('failed to find user')
      }
    }))
}

  getUserById(id: number): Observable<UserDto | undefined> {
    return this.store.select(UserState.user(id))
  }

  getUsersSortedByUsername(): Observable<UserDto[]>{
    return this.store.select<UserDto[]>(UserState.users).pipe(map( value => {
      return value.sort((a, b) => {
        if (a.username < b.username) {
          return -1;
        }
        if (a.username > b.username) {
          return 1;
        }
        return 0
      });
    }))

  }

  getUsersFromApi() {
    this.userService.getUsers().pipe(take(1),tap(users =>  {
      if (users){
        this.store.dispatch(new ClearUserStore());
        this.store.dispatch(new UpdateUserStore(users));

      }else {
        //Might break
        this.updateError(Error('failed load users'));

        throw new Error('failed load users')
      }
    })).subscribe();
  }



  deleteUser(user: UserDto) {
    this.store.dispatch(new DeleteUser(user))
    this.userService.removeUser(user).subscribe(succes => {
      this.router.navigate(['/user-list']);
    },
      (error: any) => {this.updateError(error);
      this.store.dispatch(new InsertOrUpdateUser(user))});

  }

  updateUser(user: UserDto, editedUser: EditUserDto) {
    this.store.dispatch(new InsertOrUpdateUser({id: user.id, admin: editedUser.admin, username: editedUser.username}))
    this.userService.editUser(user.username, editedUser).subscribe(succes => {
      console.log(succes)
      this.router.navigate(['/user-list']);
    }, error => {
      this.store.dispatch(new UpdateUserError(error.error))
      this.store.dispatch(new InsertOrUpdateUser(user))
    })}


}
