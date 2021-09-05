import { Component, OnInit } from '@angular/core';
import {UserDto} from "../../shared/dto/user.dto";
import {UserService} from "../shared/user.service";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  typeofUsers: UserDto[] | undefined

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUsers().pipe(take(1)).subscribe( succes => {
      this.typeofUsers = succes;
    });
  }

}
