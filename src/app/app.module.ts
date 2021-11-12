import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from "./SharedModule/shared.module";
import {HomeComponent} from './SharedModule/presentation/containers/home/home.component';
import {LoginComponent} from "./SharedModule/presentation/containers/login/login.component";
import {ReactiveFormsModule} from "@angular/forms";
import {RegisterComponent} from './user/presentation/components/register/register.component';
import {AuthGuard} from "./SharedModule/core/guards/auth.guard";
import {AuthService} from "./SharedModule/core/services/auth.service";
import {UserListComponent} from './user/presentation/components/user-list/user-list.component';
import {UserDetailComponent} from './user/presentation/components/user-detail/user-detail.component';
import {ConfirmDialogService} from "./SharedModule/presentation/components/confirm-dialog/confirm-dialog.service";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {environment} from "../environments/environment";
import {InsoleRegistrationComponent} from './insole-registration/insole-registration.component';
import {NgxsModule} from "@ngxs/store";
import {NgxsLoggerPluginModule} from "@ngxs/logger-plugin";
import {AuthFacade} from "./SharedModule/abstraction/auth.facade";
import {UserModule} from "./user/user.module";

const config: SocketIoConfig = {url: environment.apiUrl, options: {transports: ['websocket'], upgrade: false}};

@NgModule({
  declarations: [
    AppComponent,
    InsoleRegistrationComponent,
  ],
  imports: [
    UserModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config),
    NgxsModule.forRoot([], {
      developmentMode: !environment.production
    }),
    NgxsLoggerPluginModule.forRoot(),
  ],
  providers: [
    AuthFacade,
    AuthGuard,
    AuthService,
    ConfirmDialogService,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
