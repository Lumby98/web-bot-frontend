import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRegistrationRoutingModule } from './order-registration-routing.module';
import {SharedModule} from "../SharedModule/shared.module";
import { OrderRegistrationComponent } from './presentation/containers/order-registration/order-registration.component';


@NgModule({
  declarations: [
    OrderRegistrationComponent
  ],
  imports: [
    CommonModule,
    OrderRegistrationRoutingModule,
    SharedModule
  ]
})
export class OrderRegistrationModule { }
