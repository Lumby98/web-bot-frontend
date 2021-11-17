import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SharedModule} from "./SharedModule/shared.module";
import {ReactiveFormsModule} from "@angular/forms";
import {AuthGuard} from "./SharedModule/core/guards/auth.guard";
import {SocketIoConfig, SocketIoModule} from "ngx-socket-io";
import {environment} from "../environments/environment";
import {InsoleRegistrationComponent} from './insole-registration/insole-registration.component';
import {NgxsModule} from "@ngxs/store";
import {NgxsLoggerPluginModule} from "@ngxs/logger-plugin";
import {AuthFacade} from "./SharedModule/abstraction/auth.facade";
import {UserModule} from "./user/user.module";
import {ConfirmDialogFacade} from "./SharedModule/abstraction/confirm-dialog.facade";

const config: SocketIoConfig = {url: environment.apiUrl, options: {transports: ['websocket'], upgrade: false}};

@NgModule({
  declarations: [
    AppComponent,
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
    ConfirmDialogFacade,
    AuthGuard,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
