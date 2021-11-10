import {Component, OnDestroy, OnInit} from '@angular/core';
import {ExcelServices} from "../SharedModule/core/services/excel.service";
import {InsoleService} from "./shared/insole.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InsoleFromSheetDto} from "../SharedModule/dto/insole-from-sheet.dto";
import {RegisterInsoleDto} from "../SharedModule/dto/register-insole.dto";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-insole-registration',
  templateUrl: './insole-registration.component.html',
  styleUrls: ['./insole-registration.component.scss']
})
export class InsoleRegistrationComponent implements OnInit, OnDestroy {
  hide: Boolean;
  insoleForm: FormGroup;
  insoles: InsoleFromSheetDto[] | undefined;
  progressbar: boolean = false;
  error: any;
  succes: any;
  errorSubscription: Subscription | undefined;


  constructor(
    private excelService: ExcelServices,
    private insoleService: InsoleService,
    private formBuilder: FormBuilder) {
    this.hide = true;
    this.insoleForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  ngOnInit(): void {
    this.insoleForm.disable();
    this.errorSubscription = this.insoleService.listenForError().subscribe(err => {
      this.error = err;
      this.progressbar = false;
      this.insoles = undefined;
      this.insoleForm.reset();
      this.insoleForm.disable();
    });
  }

  get username() {
    return this.insoleForm.get('username');
  }

  get password() {
    return this.insoleForm.get('password');
  }

  /**
   * gets data from excel file
   * @param fileEvent
   */
  excelInputChange(fileEvent: any) {
    const file = fileEvent.target.files[0]
    if (!file) {
      this.error = 'No selected file';
      throw new Error('No selected file')
    }
    this.insoles = this.excelService.fileUpload(file);
    this.insoleForm.enable();
    console.log(this.insoles);
  }

  /**
   * registers insoles
   */
  registerInsole() {
    this.progressbar = true
    if (!this.insoles) {
      this.progressbar = false
      this.error = 'No insoles to register'
      return;
    }
    if (this.insoleForm.invalid) {
      this.progressbar = false
      this.error = 'missing information'
      return;
    }
    const insoleLogin: RegisterInsoleDto = {
      username: this.username?.value,
      password: this.password?.value,
      insoles: this.insoles
    }
    this.insoleService.listenForInsoleRegistration(insoleLogin).pipe(take(1)).subscribe(succes => {
      this.progressbar = false
      this.insoles = undefined;
      this.insoleForm.reset();
      this.insoleForm.disable();
      this.succes = succes;
    });

  }

  /**
   * clear error message
   */
  clearError() {
    this.error = undefined
  }

  /**
   * clear succes message
   */
  clearSucces() {
    this.succes = undefined
  }

  ngOnDestroy(): void {
    this.errorSubscription?.unsubscribe()
  }
}
