import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScraperRoutingModule } from './scraper-routing.module';
import { ScraperComponent } from './scraper.component';
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import {MatCardModule} from "@angular/material/card";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {ExcelServices} from "./shared/excel.service";


@NgModule({
  declarations: [
    ScraperComponent
  ], providers:[ExcelServices],
  imports: [
    CommonModule,
    ScraperRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatProgressBarModule,
  ]
})
export class ScraperModule {

}
