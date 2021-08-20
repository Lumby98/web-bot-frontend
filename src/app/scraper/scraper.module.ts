import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScraperRoutingModule } from './scraper-routing.module';
import { ScraperComponent } from './scraper.component';
import {FormControl, ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    ScraperComponent
  ],
  imports: [
    CommonModule,
    ScraperRoutingModule,
    ReactiveFormsModule
  ]
})
export class ScraperModule {

}
