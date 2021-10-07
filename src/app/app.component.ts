import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./shared/service/auth.service";
import {UserService} from "./user/shared/user.service";
import {take} from "rxjs/operators";
import {UserDto} from "./shared/dto/user.dto";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  error: any
  currentUser: UserDto | undefined
  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,) {
    const user = localStorage.getItem('currentUser')
    if(user) {
      const m = JSON.parse(user);
      this.currentUser = m.body;
    }
  }

  /**
   * handles logout
   */
  logout() {
    this.authService.logout().pipe(take(1)).subscribe(succes => {
      this.error = undefined;
      console.log(succes);
      this.router.navigate(['/home']);
    }, err => { this.error = err});
  }

  /**
   * checks if a user is logged in
   */
  loggedIn() {
    const user = localStorage.getItem('currentUser')
    if(user) {
      const m = JSON.parse(user);
      this.currentUser = m.body;
    }
    return this.authService.isAuthenticated();
  }
}
