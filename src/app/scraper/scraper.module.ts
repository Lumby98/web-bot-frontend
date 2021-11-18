import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ScraperRoutingModule} from './scraper-routing.module';
import {ScraperComponent} from './presentation/components/scraper/scraper.component';
import {SharedModule} from "../SharedModule/shared.module";
import {ExcelServices} from "../SharedModule/core/services/excel.service";
import {ScraperFacade} from "./abstraction/scraper.facade";


@NgModule({
  declarations: [
    ScraperComponent
  ],
  providers: [ExcelServices, ScraperFacade],
  imports: [
    CommonModule,
    ScraperRoutingModule,
    SharedModule,
  ]
})
export class ScraperModule {

}
