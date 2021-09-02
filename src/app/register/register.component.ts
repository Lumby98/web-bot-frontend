import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../shared/service/auth.service";
import {RegisterDto} from "../shared/dto/register.dto";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  get username() { return this.registerForm.get('username'); }
  get password() { return this.registerForm.get('password'); }
  get role() { return this.registerForm.get('role'); }

  Roles: any = ["Standard", "Admin"];
  constructor(private auth: AuthService,private formBuilder: FormBuilder) {
    this.registerForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  register() {
    if(this.registerForm.invalid){
      return;
    }
    let roleNumber;
    if (this.role?.value == "admin") {
      roleNumber = 1;
    } else {
      roleNumber = 0;
    }

    const dto: RegisterDto = {
      username: this.username?.value,
      password: this.password?.value,
      admin: roleNumber
    }

    this.auth.register(dto).subscribe();
  }
}
