import { Component, OnInit } from '@angular/core';
import {ConfirmDialogService} from "../../shared/confirm-dialog/confirm-dialog.service";
import {UserService} from "../shared/user.service";
import {UserDto} from "../../shared/dto/user.dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {EditUserDto} from "../../shared/dto/edit-user.dto";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit {
  chosenUser: UserDto | undefined;
  currentUser: UserDto | undefined;
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
    private route: ActivatedRoute) {

    this.hide = true;
    this.editForm = this.editForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['',],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userService.userById(+id).pipe(take(1)).subscribe(u => {
        if(u) {
          this.chosenUser = u
        } else {
          throw new Error('failed to find user')
        }

        if (this.chosenUser.admin == 1) {
          this.admin = 'yes'
        } else {
          this.admin = 'no'
        }

        this.username?.setValue(this.chosenUser.username);
        this.role?.setValue(this.Roles[this.chosenUser.admin]);
      })
    }
   const user = localStorage.getItem('currentUser')
    if (user) {
      this.currentUser = JSON.parse(user);
    }
  }

  /**
   * removes a user
   */
  removeUser() {
    if (!this.chosenUser) {
      this.error = 'failed to remove user';
      return;
    }
    if (this.currentUser?.username == this.chosenUser.username) {
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
        if (!this.chosenUser) {
          this.error = 'failed to remove user';
          return;
        }
        this.userService.removeUser(this.chosenUser).subscribe(succes => {
          console.log(succes);
          this.router.navigate(['/user-list']);
        });
      }
    });

  }

  /**
   * updates a user
   */
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
    if(!this.chosenUser) {
      this.error = 'failed to update user';
      throw new Error('failed to update user');
    }
    this.userService.editUser(this.chosenUser?.username, userToEdit).subscribe(succes => {
      console.log(succes)
      this.router.navigate(['/user-list']);
    }, error => {
      this.error = error.error.message;
        throw error;
      }
    );

  }

  /**
   * clears errors
   */
  clearError() {
    this.error = undefined;
  }

  /**
   * cancels edit process
   */
  cancelEdit() {
    this.editForm.reset();
    this.edit = false;

  }

  /**
   * enables editing
   */
  editStart(): void {
    if(!this.chosenUser) {
      this.error = 'no user to edit';
      throw new Error('no user');
    }
    if (this.currentUser?.username == this.chosenUser.username || this.currentUser?.admin == 1) {
      this.edit = true;
      return;
    }
    this.error = "unauthorised: cannot edit a user that isn't yourself, user";
  }
}
