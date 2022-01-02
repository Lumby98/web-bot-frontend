import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthFacade} from "../../../abstraction/auth.facade";
import {LoginTypeEnum, LoginTypeMapping} from "../../../core/enums/loginType.enum";
import {MatSelectChange} from "@angular/material/select";
import {take} from "rxjs/operators";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";
import Swal from 'sweetalert2'

@Component({
  selector: 'app-saved-logins',
  templateUrl: './saved-logins.component.html',
  styleUrls: ['./saved-logins.component.scss']
})
export class SavedLoginsComponent implements OnInit {
  hide: Boolean;
  changedKeyBool: boolean = false;
  loginInsertForm: FormGroup;
  keyChangeForm: FormGroup;
  currentKey$: Observable<string>
  public selectedType: any;
  public loginTypes: { value: LoginTypeEnum; type: string; }[] | undefined;
  error$!: Observable<any>;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  @ViewChild('keyChangeSuccessSwal')
  public readonly keyChangeSuccessSwal!: SwalComponent;

  /**
   * returns what is written in the form named username
   */
  get username() {
    return this.loginInsertForm.get('username');
  }

  /**
   * returns what is written in the form named password
   */
  get password() {
    return this.loginInsertForm.get('password');
  }

  /**
   * returns what is written in the form named newKey
   */
  get newKey() {
    return this.keyChangeForm.get('newKey');
  }

  /**
   * gets the chosen login type
   * @private
   */
  private  get  selectedLoginType():LoginTypeEnum {
    return this.selectedType ? this.selectedType.value: null;
  }

  constructor(private formBuilder: FormBuilder, private authFacade: AuthFacade) {
    this.error$ = this.authFacade.getErrorObservable();
    this.hide = true;
    this.currentKey$ = this.authFacade.getCurrentKey();
    this.loginInsertForm = this.formBuilder.group({
      loginType: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

    this.keyChangeForm = this.formBuilder.group({
      newKey: ["" , Validators.required]
    });
  }

  /**
   * disables the form fields at start of runtime
   */
  ngOnInit(): void {
    this.loginInsertForm.controls.username.disable();
    this.loginInsertForm.controls.password.disable();

    this.loginTypes = LoginTypeMapping;
  }

  /**
   * gets the selected value of the dropdown menu
   * @param event
   */
  selectChangeHandler(event: MatSelectChange) {
    this.selectedType = event.value;
    this.loginInsertForm.controls.username.enable();
    this.loginInsertForm.controls.password.enable();
  }

  /**
   * this method is called if one wants to save their login info in the DB, returns error if the form is blank, then shows a toast if successful
   */
  insertLogin() {
    if (this.loginInsertForm.invalid) {
      this.authFacade.updateError('Type, username and password cannot be blank!');
    }
    else{
      this.currentKey$.pipe(take(1)).subscribe(key => {
        this.authFacade.insertSavedLogin({loginType: this.selectedLoginType, username: this.username?.value, password: this.password?.value, key: key}).subscribe(result => {
          if (result){
            this.successSwal.fire()
          }
        })
      });
    }
  }

  /**
   * allows the user to change their key, shows a notification if successful or if the key is blank
   */
  changeKey(){
    this.currentKey$.pipe(take(1)).subscribe(key => {

      if(this.newKey?.value){
      this.authFacade.changeKey({prevPassword: key, password: this.newKey?.value}).subscribe(result => {
        if (result){
          this.keyChangeSuccessSwal.fire();
        }
      })
      }else {
        Swal.fire({
          title: 'Error!',
          text: 'Key cant be empty',
          icon: 'error',
          confirmButtonText: 'Ok'
        })
      }
    });

  }

  /**
   * clears the current error
   */
  clearError() {
    //this.error = undefined;
    this.authFacade.clearError();
  }
}


