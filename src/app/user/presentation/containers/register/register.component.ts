import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserFacade} from "../../../abstraction/user.facade";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  /**
   * gets what is written in the username form
   */
  get username() {
    return this.registerForm.get('username');
  }

  /**
   * gets what is written in the password form
   */
  get password() {
    return this.registerForm.get('password');
  }

  /**
   * gets what is written in the role form
   */
  get role() {
    return this.registerForm.get('role');
  }

  error: any | undefined;
  Roles: any = ["Standard", "Admin"];
  hide: any;

  constructor( private formBuilder: FormBuilder,private userFacade: UserFacade) {
    this.hide = true;
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  /**
   * handles registration of a user
   */
  register() {
    if (this.registerForm.invalid) {
      this.error = 'missing user information'
      this.userFacade.updateError(this.error);
      return;
    }
    let roleNumber;
    if (this.role?.value == "Admin") {
      roleNumber = 1;
    } else {
      roleNumber = 0;
    }
    this.userFacade.register({username: this.username?.value, password: this.password?.value, admin: roleNumber})
    this.error = this.userFacade.getError();


  }

  /**
   * clears error messages
   */
  clearError() {
    this.userFacade.clearError();
  }
}
