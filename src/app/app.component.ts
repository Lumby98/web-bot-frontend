import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./shared/service/auth.service";
import {UserService} from "./user/shared/user.service";
import {SharedService} from "./shared/service/shared.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  error: any
  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService,
              public sharedService: SharedService) {
  }

  logout() {
    this.sharedService.user = undefined;
    this.authService.logout().pipe(take(1)).subscribe(succes => {
      this.router.navigate(['/home']);
      this.error = undefined;
    }, err => { this.error = err});
  }

  loggedIn() {
    const user = localStorage.getItem('currentUser')
    if(user) {
      const m = JSON.parse(user);
      this.sharedService.user = m.body;
    }
    return this.authService.isAuthenticated();
  }

  goToUser() {
    const user = localStorage.getItem('currentUser')
    if(user) {
      const  m = JSON.parse(user);
      this.userService.showUser = m.body;
      this.router.navigate(['/user-detail'])
    }
  }
}
