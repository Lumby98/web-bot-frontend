import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "./shared/service/auth.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  username: string | undefined;
  error: any
  constructor(private router: Router, private authService: AuthService) {
  }

  logout() {
    this.username = undefined;
    this.authService.logout().subscribe(succes => {
      this.router.navigate(['/home']);
      this.error = undefined;
    }, err => { this.error = err});
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
