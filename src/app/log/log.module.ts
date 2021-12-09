import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LogComponent} from "./presentation/containers/log/log.component";
import {SharedModule} from "../SharedModule/shared.module";
import {LogRoutingModule} from "./log-routing.module";
import {NgxsModule} from "@ngxs/store";
import {logEntryState} from "./core/state/logEntry.state";
import {LogFacade} from "./abstraction/log-facade";
import { EditModalComponent } from './presentation/components/edit-modal/edit-modal.component';
import {FormsModule} from "@angular/forms";
@NgModule({
  declarations: [LogComponent, EditModalComponent],
  imports: [
    CommonModule,
    SharedModule,
    LogRoutingModule,
    NgxsModule.forFeature([logEntryState]),
    FormsModule,
  ],
  providers: [
    LogFacade,
  ]
})
export class LogModule { }
