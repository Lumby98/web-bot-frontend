import {AuthService} from "../../SharedModule/core/services/auth.service";
import {Store} from "@ngxs/store";
import {Router} from "@angular/router";
import {InsoleService} from "../core/services/insole.service";
import {ExcelServices} from "../../SharedModule/core/services/excel.service";
import {Observable} from "rxjs";
import {UserState} from "../../user/core/state/users.state";
import {ClearUserError, UpdateUserError} from "../../user/core/state/users.actions";
import {InsoleState} from "../core/state/insole.state";
import {ClearInsoleError, UpdateInsoleError} from "../core/state/insole.actions";
import {InsoleFromSheetDto} from "../core/models/insole-from-sheet.dto";
import {RegisterInsoleDto} from "../core/models/register-insole.dto";
import {Injectable} from "@angular/core";

@Injectable()
export class insoleRegistrationFacade{
  constructor(private insole: InsoleService, private store: Store, private router: Router, private excel: ExcelServices) {

  }

  listenForError(): Observable<string>{
    return this.insole.listenForError();
  }

  getError(): any {
    return this.store.selectOnce(InsoleState.error);
  }

  clearError(){
    this.store.dispatch(new ClearInsoleError());
  }

  updateError(error: any){
    this.store.dispatch(new UpdateInsoleError(error));
  }

  fileUpload(fileToUpload: File): InsoleFromSheetDto[]{

   return  this.excel.fileUpload(fileToUpload);
  }

  listenForInsoleRegistration(dto: RegisterInsoleDto): Observable<string>{
    return this.insole.listenForInsoleRegistration(dto);
  }





}
