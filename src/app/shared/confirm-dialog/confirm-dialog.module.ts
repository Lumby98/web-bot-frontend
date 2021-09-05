import { CommonModule } from '@angular/common';
import { NgModule} from '@angular/core';
import { ConfirmDialogService } from './confirm-dialog.service';
import { ConfirmDialogComponent } from './confirm-dialog.component';
@NgModule({
  imports: [
    CommonModule,
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
