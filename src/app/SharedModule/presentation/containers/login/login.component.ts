import {Component} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthFacade} from "../../../abstraction/auth.facade";
import {Observable} from "rxjs";
import {ConfirmDialogFacade} from "../../../../SharedModule/abstraction/confirm-dialog.facade";
import {take} from "rxjs/operators";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;


  /**
   * returns what is written in the form named username
   */
  get username() {
    return this.loginForm.get('username');
  }

  /**
   * returns what is written in the form named password
   */
  get password() {
    return this.loginForm.get('password');
  }

  /**
   * returns what is written in the form named key
   */
  get key() {
    return this.loginForm.get('key');
  }

  error$!: Observable<any>;
  hidePass: any;
  hideKey: any;

  constructor(private formBuilder: FormBuilder, private authFacade: AuthFacade,
              private confirmDialogFacade: ConfirmDialogFacade,) {
    this.error$ = this.authFacade.getErrorObservable();
    this.hidePass = true;
    this.hideKey = true;
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      key: [""]
    });

  }

  /**
   * handles login
   */
  login() {
    if (this.loginForm.invalid) {
      return;
    }

    /**
     * Handle login in without inputting key.
     */
    if(!this.key?.value){
      const options = {
        title: 'Login without key?',
        message: 'You can log in without inputting the key but the app wont have access to login info.',
        cancelText: 'Cancel',
        confirmText: 'Yes, login without key'
      }
      this.confirmDialogFacade.open(options);


      this.confirmDialogFacade.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.authFacade.login({username: this.username?.value, password: this.password?.value});
        }
      });

    }else {

      console.log("is being run")
      this.authFacade.verify({password: this.key?.value}).pipe(take(1)).subscribe(succes => {
        this.authFacade.login({username: this.username?.value, password: this.password?.value});
      }, err => {
        this.authFacade.updateError(err);

      });
    }






  }


  /**
   * clears the current error
   */
  clearError() {
    //this.error = undefined;
    this.authFacade.clearError();
  }
}
