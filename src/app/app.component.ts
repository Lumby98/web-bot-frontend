import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {UserDto} from "./user/core/models/user.dto";
import {AuthFacade} from "./SharedModule/abstraction/auth.facade";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  error: any
  currentUser: UserDto | undefined

  constructor(private router: Router,
              private authFacade: AuthFacade
  ) {
    this.currentUser = authFacade.getLocalUser()
    }

  /**
   * handles logout
   */
  logout() {
    this.authFacade.logOut();
    this.error = this.authFacade.getError();
    this.router.navigate(['/home']);
  }

  /**
   * checks if a user is logged in
   */
  loggedIn() {
    this.currentUser = this.authFacade.getLocalUser()
    return this.authFacade.isAuthenticated()
  }
}
