import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {InsoleFromSheetDto} from "../../../core/models/insole-from-sheet.dto";
import {RegisterInsoleDto} from "../../../core/models/register-insole.dto";
import {take} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";
import {insoleRegistrationFacade} from "../../../abstraction/insoleRegistrationFacade";
import {AuthFacade} from "../../../../SharedModule/abstraction/auth.facade";
import {ScrapeDto} from "../../../../scraper/core/models/scrape.dto";

@Component({
  selector: 'app-insole-registration',
  templateUrl: './insole-registration.component.html',
  styleUrls: ['./insole-registration.component.scss']
})
export class InsoleRegistrationComponent implements OnInit, OnDestroy {
  hide: Boolean;
  insoles: InsoleFromSheetDto[] | undefined;
  progressbar: boolean = false;
  error: any;
  succes: any;
  errorSubscription: Subscription | undefined;
  currentKey$: Observable<string>;

  constructor(
    private insoleFacade: insoleRegistrationFacade,
    private formBuilder: FormBuilder,
    private authFacade: AuthFacade) {
    this.hide = true;
    this.currentKey$ = this.authFacade.getCurrentKey();

  }

  ngOnInit(): void {

    this.errorSubscription = this.insoleFacade.listenForError().subscribe(err => {
      this.error = err;
      this.progressbar = false;
      this.insoles = undefined;
    });
  }

  /**
   * gets data from excel file
   * @param fileEvent
   */
  excelInputChange(fileEvent: any) {
    const file = fileEvent.target.files[0]
    if (!file) {
      this.error = 'No selected file';
      this.insoleFacade.updateError(this.error);
      throw new Error('No selected file')
    }
    this.insoles = this.insoleFacade.fileUpload(file);
    console.log(this.insoles);
  }

  /**
   * registers insoles
   */
  registerInsole() {

    this.currentKey$.pipe(take(1)).subscribe(key => {
      if (key) {
        this.progressbar = true
        if (!this.insoles) {
          this.progressbar = false
          this.error = 'No insoles to register'
          this.insoleFacade.updateError(this.error);
          return;
        }

        const insoleLogin: RegisterInsoleDto = {
          key: key,
          insoles: this.insoles
        }

        this.insoleFacade.listenForInsoleRegistration(insoleLogin).pipe(take(1)).subscribe(succes => {
          this.progressbar = false
          this.insoles = undefined;
          this.succes = succes;
        });


      } else {
        this.error = 'Could not get key';
        this.progressbar = false;
        throw Error(this.error);
      }


    }, error => {
      this.error = error.message;
      this.progressbar = false;
      throw Error(error);
    });


  }

  /**
   * clear error message
   */
  clearError() {
    this.error = undefined
    this.insoleFacade.clearError()
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
