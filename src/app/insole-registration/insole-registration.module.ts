import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsoleRegistrationRoutingModule } from './insole-registration-routing.module';
import {SharedModule} from "../SharedModule/shared.module";
import {InsoleRegistrationComponent} from "./presentation/components/insole-registration/insole-registration.component";
import {NgxsModule} from "@ngxs/store";
import {InsoleState} from "./core/state/insole.state";



@NgModule({
  declarations: [InsoleRegistrationComponent],
  imports: [
    CommonModule,
    InsoleRegistrationRoutingModule,
    SharedModule,
    NgxsModule.forFeature([InsoleState]),
  ]
})
export class InsoleRegistrationModule { }
