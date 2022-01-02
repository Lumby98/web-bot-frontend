import {Store} from "@ngxs/store";
import {Router} from "@angular/router";
import {InsoleService} from "../core/services/insole.service";
import {ExcelServices} from "../../SharedModule/core/services/excel.service";
import {Observable} from "rxjs";
import {InsoleState} from "../core/state/insole.state";
import {ClearInsoleError, UpdateInsoleError} from "../core/state/insole.actions";
import {InsoleFromSheetDto} from "../core/models/insole-from-sheet.dto";
import {RegisterInsoleDto} from "../core/models/register-insole.dto";
import {Injectable} from "@angular/core";

/**
 * Facade that encapsulates the store and services used in the insole-registration module.
 */
@Injectable()
export class insoleRegistrationFacade{
  constructor(private insole: InsoleService, private store: Store, private router: Router, private excel: ExcelServices) {

  }

  /**
   * calls the listenForError method on the insoleService
   */
  listenForError(): Observable<string>{
    return this.insole.listenForError();
  }

  /**
   * calls the store to get the current value of the error in the insoleState
   */
  getError(): any {
    return this.store.selectOnce(InsoleState.error);
  }

  /**
   * dispatches a new ClearInsoleError() action the the store.
   */
  clearError(){
    this.store.dispatch(new ClearInsoleError());
  }

  /**
   * dispatches a new UpdateInsoleError() action the the store with an error as an argument.
   * @param error
   */
  updateError(error: any){
    this.store.dispatch(new UpdateInsoleError(error));
  }

  /**
   * calls the fileUpload() method on the excel service
   * @param fileToUpload
   */
  fileUpload(fileToUpload: File): InsoleFromSheetDto[]{
   return  this.excel.fileUpload(fileToUpload);
  }

  /**
   * calls the listenForInsoleRegistration() method on excel service
   * @param dto
   */
  listenForInsoleRegistration(dto: RegisterInsoleDto): Observable<string>{
    return this.insole.listenForInsoleRegistration(dto);
  }





}
