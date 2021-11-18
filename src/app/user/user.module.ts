import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {UserDetailComponent} from "./presentation/components/user-detail/user-detail.component";
import {UserListComponent} from "./presentation/components/user-list/user-list.component";
import {SharedModule} from "../SharedModule/shared.module";
import {RouterModule} from "@angular/router";
import {RegisterComponent} from "./presentation/components/register/register.component";
import {NgxsModule} from "@ngxs/store";
import {UserState} from "./core/state/users.state";
import {UserFacade} from "./abstraction/user.facade";



@NgModule({
  declarations: [UserDetailComponent,UserListComponent,RegisterComponent],
  imports: [
    RouterModule,
    CommonModule,
    SharedModule,
    NgxsModule.forFeature([UserState])
  ],
  providers: [
    UserFacade
  ]
})
export class UserModule { }
