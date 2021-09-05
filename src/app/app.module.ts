import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {SharedModule} from "./shared/shared.module";
import { HomeComponent } from './home/home.component';
import {LoginComponent} from "./login/login.component";
import {ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './register/register.component';
import {AuthGuard} from "./shared/guard/auth.guard";
import {AuthService} from "./shared/service/auth.service";
import { UserListComponent } from './user/user-list/user-list.component';
import { UserDetailComponent } from './user/user-detail/user-detail.component';
import {ConfirmDialogComponent} from "./shared/confirm-dialog/confirm-dialog.component";
import {ConfirmDialogModule} from "./shared/confirm-dialog/confirm-dialog.module";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    UserListComponent,
    UserDetailComponent,
    ConfirmDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    ReactiveFormsModule,
    ConfirmDialogModule,
  ],
  providers: [
    AuthGuard,
    AuthService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
