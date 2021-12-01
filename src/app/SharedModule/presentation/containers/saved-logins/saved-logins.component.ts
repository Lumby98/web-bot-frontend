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

  get username() {
    return this.loginInsertForm.get('username');
  }

  get password() {
    return this.loginInsertForm.get('password');
  }

  get newKey() {
    return this.keyChangeForm.get('newKey');
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

    this.keyChangeForm = this.formBuilder.group({
      newKey: ["" , Validators.required]
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

  clearError() {
    //this.error = undefined;
    this.authFacade.clearError();
  }
}


