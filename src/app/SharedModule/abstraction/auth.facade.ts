import {Injectable} from "@angular/core";
import {AuthService} from "../core/services/auth.service";
import {UserDto} from "../../user/core/models/user.dto";
import {take, tap} from "rxjs/operators";
import {Store} from "@ngxs/store";
import {ClearError, ClearKey, UpdateError, UpdateKey} from "../core/state/auth/auth.actions";
import {AuthState} from "../core/state/auth/auth.state";
import {LoginDto} from "../core/models/login.dto";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {KeyDto} from "../core/models/Key.dto";
import {InsertSavedLoginDto} from "../core/models/insert-SavedLogin.dto";
import {UpdateUserError} from "../../user/core/state/users.actions";
import {InsertKeyDto} from "../core/models/insert-Key.dto";

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
      this.store.dispatch(new ClearKey());
    }, err => {
      this.store.dispatch(new ClearKey());
      this.store.dispatch(new UpdateError(err));
    });
  }

  getError(): Observable<any> {
    return this.store.selectOnce(AuthState.error);
  }

  getCurrentKey(): Observable<string> {
    return this.store.select(AuthState.key);
  }

  getErrorObservable(): Observable<any> {
    return this.store.select(AuthState.error);
  }


  clearError(){
    this.store.dispatch(new ClearError());
  }


  updateError(error: any){
    this.store.dispatch(new UpdateError(error));
  }

  isAuthenticated(): boolean {
    return this.auth.isAuthenticated();
  }


  insertSavedLogin(insertSavedLoginDto: InsertSavedLoginDto ): Observable<boolean>{
    return this.auth.insertSavedLogin(insertSavedLoginDto).pipe(take(1), tap(success =>{

    }, err => {
      this.store.dispatch(new UpdateError(err));
    }))

  }

  verify(key: KeyDto): Observable<boolean>{
   return this.auth.verify(key).pipe(tap(boolean =>{
     if(boolean){
       this.store.dispatch(new UpdateKey(key.password));
     }else {
       this.updateError(Error('failed to verify key'))
     }
   }))
  }

  changeKey(key: InsertKeyDto): Observable<boolean>{
    return this.auth.changeKey(key).pipe(tap(boolean =>{
      if(boolean){
        this.store.dispatch(new UpdateKey(key.password));
      }else {
        this.updateError(Error('failed to change key'))
      }
    }))
  }

}
