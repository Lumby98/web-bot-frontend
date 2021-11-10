import {Injectable} from '@angular/core';
import {Observable} from "rxjs";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "./confirm-dialog.component";
import {map, take} from "rxjs/operators";


@Injectable()
export class ConfirmDialogService {
  constructor(private dialog: MatDialog) {
  }

  dialogRef: MatDialogRef<ConfirmDialogComponent> | undefined;

  /**
   * opens confirmation dialog
   * @param options
   */
  public open(options: { title: any; message: any; cancelText: any; confirmText: any; }) {
    this.dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: options.title,
        message: options.message,
        cancelText: options.cancelText,
        confirmText: options.confirmText
      }
    });
  }

  /**
   * send a trigger to know that confirm has been pressed
   */
  public confirmed(): Observable<any> {
    if (this.dialogRef) {
      return this.dialogRef.afterClosed().pipe(take(1), map(res => {
          return res;
        }
      ));
    }
    throw new Error('something went wrong trying to display dialog');
  }
}
