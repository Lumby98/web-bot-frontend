import { Injectable } from '@angular/core';
import {InsoleFromSheetDto} from "../../shared/dto/insole-from-sheet.dto";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {RegisterInsoleDto} from "../../shared/dto/register-insole.dto";

@Injectable({
  providedIn: 'root'
})
export class InsoleService {

  constructor(private http: HttpClient) { }

  /**
   * calls the api to register insoles
   * registerInsoleDto contains a username, password and a list of insoles
   * @param insoles
   */
  registerInsoles(insoles: RegisterInsoleDto) {
    return this.http.post(environment.apiUrl  + '/insole', insoles);
  }
}
