import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../../../SharedModule/core/services/auth.service";
import {RegisterDto} from "../../../core/models/register.dto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  get username() {
    return this.registerForm.get('username');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get role() {
    return this.registerForm.get('role');
  }

  error: any | undefined;
  Roles: any = ["Standard", "Admin"];
  hide: any;

  constructor(private auth: AuthService, private formBuilder: FormBuilder, private router: Router) {
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
      return;
    }
    let roleNumber;
    if (this.role?.value == "Admin") {
      roleNumber = 1;
    } else {
      roleNumber = 0;
    }

    const dto: RegisterDto = {
      username: this.username?.value,
      password: this.password?.value,
      admin: roleNumber
    }

    this.auth.register(dto).subscribe(succes => {
      this.router.navigate(['/user-list']);
      this.error = undefined;
    }, err => {
      this.error = err
    });
  }

  /**
   * clears error messages
   */
  clearError() {
    this.error = undefined;
  }
}
