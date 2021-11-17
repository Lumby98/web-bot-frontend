import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InsoleRegistrationRoutingModule } from './insole-registration-routing.module';
import {SharedModule} from "../SharedModule/shared.module";
import {InsoleRegistrationComponent} from "./insole-registration.component";


@NgModule({
  declarations: [InsoleRegistrationComponent],
  imports: [
    CommonModule,
    InsoleRegistrationRoutingModule,
    SharedModule
  ]
})
export class InsoleRegistrationModule { }
