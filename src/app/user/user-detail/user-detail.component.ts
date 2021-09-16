import { Component, OnInit } from '@angular/core';
import {ConfirmDialogService} from "../../shared/confirm-dialog/confirm-dialog.service";
import {UserService} from "../shared/user.service";
import {UserDto} from "../../shared/dto/user.dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {EditUserDto} from "../../shared/dto/edit-user.dto";
import {SharedService} from "../../shared/service/shared.service";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  editUser: UserDto
  admin: any;
  edit: boolean = false;
  editForm: FormGroup;
  get username() { return this.editForm.get('username'); }
  get password() { return this.editForm.get('password'); }
  get role() { return this.editForm.get('role'); }
  error: any | undefined;
  Roles: any = ["Standard", "Admin"];
  hide: any;
  constructor(
    private dialogService: ConfirmDialogService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private router: Router,
    public sharedService: SharedService) {

    this.hide = true;
    this.editUser = this.userService.showUser;
    this.editForm = this.editForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['',],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
      if (this.editUser.admin == 1) {
        this.admin = 'yes'
      } else {
        this.admin = 'no'
      }

  }

  removeUser(user: UserDto) {
    if (this.sharedService.user?.username == this.editUser.username) {
      this.error = 'cannot delete yourself'
      return;
    }

    const options = {title: 'Remove user?',
      message: 'Removing a user is permanent and they cannot be restored',
      cancelText: 'Cancel',
      confirmText: 'Yes, remove user'}
    this.dialogService.open(options);

    this.dialogService.confirmed().subscribe(confirmed => {
      if(confirmed){
        this.userService.removeUser(user).subscribe(succes => {
          console.log(succes);
          this.router.navigate(['/user-list']);
        });
      }
    });

  }

  updateUser() {
    if(this.editForm.invalid) {
      this.error = 'need more details, username and admin cannot be blank'
    }
    let a;
    if (this.role?.value == 'Admin') {
      a = 1;
    } else {
      a = 0
    }
    const userToEdit: EditUserDto = {
      username: this.username?.value,
      password: this.password?.value,
      admin: a
    };
    this.userService.editUser(userToEdit).subscribe(succes => {
      console.log(succes)
      this.router.navigate(['/user-list']);
    })

  }

  clearError() {
    this.error = undefined;
  }

  cancelEdit() {
    this.editForm.reset();
    this.edit = false;

  }

  editStart(): void {
    const current = this.sharedService.user;
    console.log('method called')
    console.log(current)
    console.log(this.editUser)
    if (current?.username == this.editUser.username || current?.admin == 1) {
      this.username?.setValue(this.editUser.username);
      this.role?.setValue(this.Roles[this.editUser.admin])
      this.edit = true;
      return;
    }
    this.error = "unauthorised: cannot edit a user that isn't yourself, user";
  }
}
