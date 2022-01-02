import {Injectable} from "@angular/core";
import {ConfirmDialogService} from "../presentation/components/confirm-dialog/confirm-dialog.service";
import {Observable} from "rxjs";
import {MatDialogRef} from "@angular/material/dialog";
import {ConfirmDialogComponent} from "../presentation/components/confirm-dialog/confirm-dialog.component";

@Injectable()
export class ConfirmDialogFacade{
  constructor(private confirmDialogService: ConfirmDialogService) {
  }

  /**
   * shows a dialog message with the given options
   * @param options
   */
  open(options: { title: any; message: any; cancelText: any; confirmText: any; }){
    this.confirmDialogService.open(options);
  }

  /**
   * returns if the dialog has been confirmed
   */
  confirmed(): Observable<any>{
    return this.confirmDialogService.confirmed();
  }

  /**
   * returns the dialog reference
   */
  getDialogRef() : MatDialogRef<ConfirmDialogComponent> | undefined{
    return this.confirmDialogService.dialogRef;
  }

  setDialogRef(dialogRef : MatDialogRef<ConfirmDialogComponent>) {

    this.confirmDialogService.dialogRef = dialogRef;

  }

}
