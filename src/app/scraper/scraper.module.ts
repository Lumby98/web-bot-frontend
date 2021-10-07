import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScraperRoutingModule } from './scraper-routing.module';
import { ScraperComponent } from './scraper.component';
import { SharedModule } from "../shared/shared.module";
import {ExcelServices} from "../shared/service/excel.service";


@NgModule({
  declarations: [
    ScraperComponent
  ],
  providers:[ExcelServices],
  imports: [
    CommonModule,
    ScraperRoutingModule,
    SharedModule,
  ]
})
export class ScraperModule {

}
