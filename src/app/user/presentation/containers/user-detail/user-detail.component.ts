import {Component, OnInit} from '@angular/core';
import {UserDto} from "../../../core/models/user.dto";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {EditUserDto} from "../../../core/models/edit-user.dto";
import {take} from "rxjs/operators";
import {UserFacade} from "../../../abstraction/user.facade";
import {AuthFacade} from "../../../../SharedModule/abstraction/auth.facade";
import {ConfirmDialogFacade} from "../../../../SharedModule/abstraction/confirm-dialog.facade";

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

  /**
   * gets what is written in the username form
   */
  get username() {
    return this.editForm.get('username');
  }

  /**
   * gets what is written in the password form
   */
  get password() {
    return this.editForm.get('password');
  }

  /**
   * gets what is written in the role form
   */
  get role() {
    return this.editForm.get('role');
  }

  error: any | undefined;
  Roles: any = ["Standard", "Admin"];
  hide: any;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private confirmDialogFacade: ConfirmDialogFacade,
    private userFacade: UserFacade,
    private auth: AuthFacade
  ) {

    // override the route reuse strategy
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    }

    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        // trick the Router into believing its last link wasn't previously loaded
        this.router.navigated = false;
        // if you need to scroll back to top, here is the right place
        window.scrollTo(0, 0);
      }
    });

    this.hide = true;
    this.editForm = this.editForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['',],
      role: ['', Validators.required]
    });
  }

  /**
   * gets the id from the URL and gets the matching user from the DB, checks if it is admin and sets the role accordingly
   */
  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.userFacade.getUserByIdFromApi(+id).pipe(take(1)).subscribe(user => {
        this.userFacade.getUserById(+id).pipe(take(1)).subscribe(u => {
          if (u) {
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

      })
    }
    this.currentUser = this.auth.getLocalUser()
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

    const options = {
      title: 'Remove user?',
      message: 'Removing a user is permanent and they cannot be restored',
      cancelText: 'Cancel',
      confirmText: 'Yes, remove user'
    }

    this.confirmDialogFacade.open(options);
    this.confirmDialogFacade.confirmed().subscribe(confirmed => {
      if (confirmed) {
        if (!this.chosenUser) {
          this.error = 'failed to remove user';
          return;
        }
        this.userFacade.deleteUser(this.chosenUser)

      }
    });



  }

  /**
   * updates a user
   */
  updateUser() {
    if (this.editForm.invalid) {
      this.error = 'need more details, username and admin cannot be blank'
      this.userFacade.updateError(this.error)
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
    if (!this.chosenUser) {
      this.error = 'failed to update user';
      this.userFacade.updateError(this.error)
      throw new Error('failed to update user');
    }
    this.userFacade.updateUser(this.chosenUser, userToEdit)
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
    if (!this.chosenUser) {
      this.error = 'no user to edit';
      throw new Error('no user');
    }
    if (this.currentUser?.username == this.chosenUser.username || this.currentUser?.admin == 1) {
      this.edit = true;
      return;
    }
    this.error = "unauthorised: cannot edit a user that isn't yourself, user";
    this.userFacade.updateError(this.error);
  }
}
