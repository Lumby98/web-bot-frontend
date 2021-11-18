import {Component, OnInit} from '@angular/core';
import {UserDto} from "../../../../user/core/models/user.dto";
import {AuthFacade} from "../../../abstraction/auth.facade";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: UserDto | undefined;

  constructor( private authFacade: AuthFacade) {
    this.currentUser = authFacade.getLocalUser()
  }

  ngOnInit(): void {

  }

  /**
   * logs out a user
   */
  logout() {
    this.authFacade.logOut();
  }

  /**
   * checks if a user is logged in
   */
  loggedIn() {
    return this.authFacade.isAuthenticated()
  }
}
