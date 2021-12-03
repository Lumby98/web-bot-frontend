import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogComponent} from "./presentation/log/log.component";
import {SharedModule} from "../SharedModule/shared.module";
import {LogRoutingModule} from "./log-routing.module";



@NgModule({
  declarations: [LogComponent],
  imports: [
    CommonModule,
    SharedModule,
    LogRoutingModule
  ]
})
export class LogModule { }
