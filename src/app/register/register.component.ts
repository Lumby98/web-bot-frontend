import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  Roles: any = ["0 : Standard", "1 : Admin"];
  constructor() { }

  ngOnInit(): void {
  }

}
