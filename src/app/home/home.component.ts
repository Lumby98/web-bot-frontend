import { Component, OnInit } from '@angular/core';
import {AuthService} from "../shared/service/auth.service";
import {SharedService} from "../shared/service/shared.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private auth: AuthService, public sharedService: SharedService) { }

  ngOnInit(): void {
  }

  logout() {
    this.sharedService.user = undefined;
    this.auth.logout().pipe(take(1)).subscribe();
  }

  loggedIn() {
    return this.auth.isAuthenticated();
  }
}
