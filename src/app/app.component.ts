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
  title = 'web-bot-frontend';
  constructor(private router: Router, private authService: AuthService) {
  }

  logout() {
    this.authService.logout();
  }

  loggedIn() {
    return this.authService.isAuthenticated();
  }
}
