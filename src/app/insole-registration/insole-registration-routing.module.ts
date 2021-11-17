import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {InsoleRegistrationComponent} from "./insole-registration.component";

const routes: Routes = [{path: '', component: InsoleRegistrationComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InsoleRegistrationRoutingModule { }
