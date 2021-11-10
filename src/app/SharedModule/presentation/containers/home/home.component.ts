import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/auth.service";
import {take} from "rxjs/operators";
import {UserDto} from "../../../dto/user.dto";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: UserDto | undefined;

  constructor(private auth: AuthService) {
    const user = localStorage.getItem('currentUser')
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  ngOnInit(): void {

  }

  /**
   * logs out a user
   */
  logout() {
    this.auth.logout().pipe(take(1)).subscribe();
  }

  /**
   * checks if a user is logged in
   */
  loggedIn() {
    return this.auth.isAuthenticated();
  }
}
