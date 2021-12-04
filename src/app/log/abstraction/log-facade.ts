import {Injectable} from "@angular/core";
import {Store} from "@ngxs/store";

@Injectable()
export class LogFacade {

  constructor(private store: Store) {
  }
}
