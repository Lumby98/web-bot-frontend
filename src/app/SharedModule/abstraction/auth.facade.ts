import {Injectable} from "@angular/core";
import {AuthService} from "../core/services/auth.service";

@Injectable()
export class AuthFacade{
  constructor(private auth: AuthService,) {
  }
}
