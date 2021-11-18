import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../core/services/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginDto} from "../../../core/models/login.dto";
import {Router} from "@angular/router";
import {AuthFacade} from "../../../abstraction/auth.facade";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  get username() {
    return this.loginForm.get('username');
  }

  get password() {
    return this.loginForm.get('password');
  }

  error: string | undefined;
  hide: any;

  constructor(private formBuilder: FormBuilder, private authFacade: AuthFacade ) {
    this.hide = true;
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  /**
   * handles login
   */
  login() {
    if (this.loginForm.invalid) {
      return;
    }
    this.authFacade.login({username: this.username?.value, password: this.password?.value});
    this.error = this.authFacade.getError();


  }

  clearError() {
    this.error = undefined;
    this.authFacade.clearError();
  }
}
