import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogComponent} from "./presentation/log/log.component";
import {SharedModule} from "../SharedModule/shared.module";
import {LogRoutingModule} from "./log-routing.module";
import {NgxsModule} from "@ngxs/store";
import {logEntryState} from "./core/state/logEntry.state";
import {LogFacade} from "./abstraction/log-facade";
@NgModule({
  declarations: [LogComponent],
  imports: [
    CommonModule,
    SharedModule,
    LogRoutingModule,
    NgxsModule.forFeature([logEntryState]),
  ],
  providers: [
    LogFacade,
  ]
})
export class LogModule { }
