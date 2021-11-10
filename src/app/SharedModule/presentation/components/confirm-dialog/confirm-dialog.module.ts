import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ConfirmDialogService} from './confirm-dialog.service';
import {ConfirmDialogComponent} from './confirm-dialog.component';
import {SharedModule} from "../../../shared.module";

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
  ],
  declarations: [
    ConfirmDialogComponent
  ],
  exports: [ConfirmDialogComponent],
  entryComponents: [ConfirmDialogComponent],
  providers: [ConfirmDialogService]
})
export class ConfirmDialogModule {
}
