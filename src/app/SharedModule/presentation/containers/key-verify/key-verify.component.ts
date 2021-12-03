import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthFacade} from "../../../abstraction/auth.facade";
import {take} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-key-verify',
  templateUrl: './key-verify.component.html',
  styleUrls: ['./key-verify.component.scss']
})
export class KeyVerifyComponent implements OnInit {

  keyVerifyForm: FormGroup;
  hide: boolean = true;
  error$!: Observable<any>;

  constructor(private formBuilder: FormBuilder, private authFacade: AuthFacade) {
    this.keyVerifyForm = this.formBuilder.group({
      key: ["" , Validators.required]
    });

    this.error$ = this.authFacade.getErrorObservable();
  }

  get key() {
    return this.keyVerifyForm.get('key');
  }

  clearError() {
    //this.error = undefined;
    this.authFacade.clearError();
  }

  verifyKey(){
    this.authFacade.verify({password: this.key?.value}).pipe(take(1)).subscribe( success => {},err => {
      this.authFacade.updateError(err);
    });

  }

  ngOnInit(): void {

  }

}
