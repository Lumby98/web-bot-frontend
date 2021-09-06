import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./shared/service/auth.service";
import {UserDto} from "./shared/dto/user.dto";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  username: string | undefined;
  constructor(private router: Router, private authService: AuthService) {
  }

  logout() {
    this.username = undefined;
    this.authService.logout();
  }

  loggedIn() {
    const user = localStorage.getItem('currentUser')
    if(user) {
      const m = JSON.parse(user);
      this.username = m.body.username;
    }
    return this.authService.isAuthenticated();
  }
}
