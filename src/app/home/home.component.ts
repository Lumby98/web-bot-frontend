import { Component, OnInit } from '@angular/core';
import {AuthService} from "../shared/service/auth.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  loggedIn: any;

  constructor(private auth: AuthService) { }

  ngOnInit(): void {
  }

  logout() {
    this.loggedIn = false;
    this.auth.logout();
  }
}
