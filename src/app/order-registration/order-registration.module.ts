import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRegistrationRoutingModule } from './order-registration-routing.module';
import {SharedModule} from "../SharedModule/shared.module";


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    OrderRegistrationRoutingModule,
    SharedModule
  ]
})
export class OrderRegistrationModule { }
