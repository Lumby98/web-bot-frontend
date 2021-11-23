import { Component, OnInit } from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder} from "@angular/forms";
import {AuthFacade} from "../../../abstraction/auth.facade";

@Component({
  selector: 'app-saved-logins',
  templateUrl: './saved-logins.component.html',
  styleUrls: ['./saved-logins.component.scss']
})
export class SavedLoginsComponent implements OnInit {

  currentKey$: Observable<string>

  constructor(private formBuilder: FormBuilder, private authFacade: AuthFacade) {
    this.currentKey$ = this.authFacade.getCurrentKey();
  }

  ngOnInit(): void {
  }

}
