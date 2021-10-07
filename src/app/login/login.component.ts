import { Component, OnInit } from '@angular/core';
import {AuthService} from "../shared/service/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginDto} from "../shared/dto/login.dto";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  error: string | undefined;
  hide: any;
  constructor(private auth: AuthService,private formBuilder: FormBuilder, private router: Router) {
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
    if(this.loginForm.invalid)
    {
      return;
    }
    const dto: LoginDto = {username: this.username?.value, password: this.password?.value}
    this.auth.login(dto).subscribe(succes => {
      this.router.navigate(['/home']);
      this.error = undefined;
    }, err => { this.error = err});

  }

  clearError() {
    this.error = undefined;
  }
}
