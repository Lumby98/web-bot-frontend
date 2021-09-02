import { Component, OnInit } from '@angular/core';
import {AuthService} from "../shared/service/auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {LoginDto} from "../shared/dto/login.dto";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  constructor(private auth: AuthService,private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  login() {
    if(this.loginForm.invalid)
    {
      return;
    }
    const dto: LoginDto = {username: this.username?.value, password: this.password?.value}
    this.auth.login(dto).subscribe();
  }
}
