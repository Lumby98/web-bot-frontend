import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserDetailComponent} from "./presentation/components/user-detail/user-detail.component";
import {UserListComponent} from "./presentation/components/user-list/user-list.component";
import {SharedModule} from "../SharedModule/shared.module";
import {RouterModule} from "@angular/router";
import {RegisterComponent} from "./presentation/components/register/register.component";



@NgModule({
  declarations: [UserDetailComponent,UserListComponent,RegisterComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule
  ]
})
export class UserModule { }
