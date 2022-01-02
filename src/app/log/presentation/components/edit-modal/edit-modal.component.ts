import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {EditDialogData} from "../../dto/edit-dialog-data";
import {LogFacade} from "../../../abstraction/log-facade";
import {UpdateLogDto} from "../../dto/update-log.dto";
import {LogEntryDto} from "../../dto/log-entry.dto";
import {logEntryState} from "../../../core/state/logEntry.state";
import {FormControl} from "@angular/forms";

@Component({
  selector: 'app-edit-modal',
  templateUrl: './edit-modal.component.html',
  styleUrls: ['./edit-modal.component.scss']
})
export class EditModalComponent implements OnInit {

  editErrorForm = new FormControl("");

  constructor(
    public dialogRef: MatDialogRef<EditModalComponent>,
    private logFacade: LogFacade,
    @Inject(MAT_DIALOG_DATA) public data: EditDialogData,
  ) {
  }

  /**
   * gets called on component startup. Sets the value of the editErrorForm
   */
  ngOnInit(): void {
    this.editErrorForm.setValue(this.data.log.error?.displayErrorMessage);
  }

  /**
   * closes the modal
   */
  onCancelClick(): void {
    this.dialogRef.close();
  }

  /**
   * updates the error message on the log and closes the modal.
   */
  onOkClick() {
    let logEntryToUpdate: LogEntryDto;
    if (this.data.log.error) {
      logEntryToUpdate = {
        id: this.data.log.id,
        error: {
          id: this.data.log.error?.id,
          errorMessage: this.data.log.error?.errorMessage,
          displayErrorMessage: this.editErrorForm.value
        },
        order: this.data.log.order,
        timestamp: this.data.log.timestamp,
        process: this.data.log.process,
        status: this.data.log.status,
      }
    } else {
      this.logFacade.updateError('This log does not have an error, cannot update error message');
      return;
    }

    this.logFacade.updateLogEntry(logEntryToUpdate);
    this.dialogRef.close();
  }


}
