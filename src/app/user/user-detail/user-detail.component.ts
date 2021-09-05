import { Component, OnInit } from '@angular/core';
import {ConfirmDialogService} from "../../shared/confirm-dialog/confirm-dialog.service";
import {UserService} from "../shared/user.service";
import {UserDto} from "../../shared/dto/user.dto";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  deleteUser: any;
  constructor(private dialogService: ConfirmDialogService, private userService: UserService) { }

  ngOnInit(): void {
    this.deleteUser = false
  }

  removeUser(user: UserDto) {
    const options = {title: 'Remove user?',
      message: 'Are you sure you want to remove this user',
      cancelText: 'Cancel',
      confirmText: 'Remove'}
    this.dialogService.open(options);

    this.dialogService.confirmed().subscribe(confirmed => {
      if(confirmed)
      {
        this.userService.removeUser(user);
      }
    })

  }
}
