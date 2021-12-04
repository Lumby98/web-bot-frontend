import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRegistrationRoutingModule } from './order-registration-routing.module';
import {SharedModule} from "../SharedModule/shared.module";
import { OrderRegistrationComponent } from './presentation/containers/order-registration/order-registration.component';
import {orderRegistrationFacade} from "./abstraction/orderRegistration.facade";
import {NgxsModule} from "@ngxs/store";
import {orderRegLogEntryState} from "./core/state/orderRegLogEntry.state";


@NgModule({
  declarations: [
    OrderRegistrationComponent
  ],
  imports: [
    CommonModule,
    OrderRegistrationRoutingModule,
    SharedModule,
    NgxsModule.forFeature([orderRegLogEntryState]),
  ],

  providers: [
  orderRegistrationFacade,
]
})
export class OrderRegistrationModule { }
