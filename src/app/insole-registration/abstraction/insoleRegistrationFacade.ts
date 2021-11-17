import {AuthService} from "../../SharedModule/core/services/auth.service";
import {Store} from "@ngxs/store";
import {Router} from "@angular/router";
import {InsoleService} from "../core/services/insole.service";
import {ExcelServices} from "../../SharedModule/core/services/excel.service";


export class insoleRegistrationFacade{
  constructor(private insole: InsoleService, private store: Store, private router: Router, private excel: ExcelServices) {
  }
}
