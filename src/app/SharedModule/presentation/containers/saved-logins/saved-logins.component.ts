import {Component, OnInit, ViewChild} from '@angular/core';
import {Observable} from "rxjs";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthFacade} from "../../../abstraction/auth.facade";
import {LoginTypeEnum, LoginTypeMapping} from "../../../core/enums/loginType.enum";
import {MatSelectChange} from "@angular/material/select";
import {take} from "rxjs/operators";
import {SwalComponent} from "@sweetalert2/ngx-sweetalert2";

@Component({
  selector: 'app-saved-logins',
  templateUrl: './saved-logins.component.html',
  styleUrls: ['./saved-logins.component.scss']
})
export class SavedLoginsComponent implements OnInit {
  hide: Boolean;
  loginInsertForm: FormGroup;
  keyVerifyFrom: FormGroup;
  currentKey$: Observable<string>
  public selectedType: any;
  public loginTypes: { value: LoginTypeEnum; type: string; }[] | undefined;
  error$!: Observable<any>;

  @ViewChild('successSwal')
  public readonly successSwal!: SwalComponent;

  get username() {
    return this.loginInsertForm.get('username');
  }

  get password() {
    return this.loginInsertForm.get('password');
  }

  get key() {
    return this.keyVerifyFrom.get('key');
  }

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

    this.keyVerifyFrom = this.formBuilder.group({
      key: ["" , Validators.required]
    });
  }

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

  verifyKey(){
    this.authFacade.verify({password: this.key?.value}).pipe(take(1)).subscribe( success => {},err => {
      this.authFacade.updateError(err);
    });

  }

  clearError() {
    //this.error = undefined;
    this.authFacade.clearError();
  }
}


