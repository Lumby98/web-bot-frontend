import {Injectable} from "@angular/core";
import {CanActivate, Router} from "@angular/router";
import {AuthService} from "../services/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {


  constructor(private router: Router,
              private authService: AuthService) {
  }

  canActivate() {
    //check to see if a user has a valid token
    if (this.authService.isAuthenticated()) {

      //if they do, return and allow the user to load app
      return true;
    }

    //if not, they redirect them to the login page
    this.router.navigate(['/login']);
    return false;
  }
}
