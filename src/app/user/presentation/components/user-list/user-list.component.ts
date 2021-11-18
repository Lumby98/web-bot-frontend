import {Component, OnInit,} from '@angular/core';
import {UserDto} from "../../../core/models/user.dto";
import {UserService} from "../../../core/services/user.service";
import {UserFacade} from "../../../abstraction/user.facade";
import {AuthFacade} from "../../../../SharedModule/abstraction/auth.facade";
import {Observable} from "rxjs";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  $typeOfUsers: Observable<UserDto[]> | undefined;
  currentUser: UserDto | undefined

  constructor( private userFacade: UserFacade, private auth: AuthFacade) {
  }

  ngOnInit(): void {
    this.userFacade.getUsersFromApi();

    this.$typeOfUsers = this.userFacade.getUsersSortedByUsername();

    this.currentUser = this.auth.getLocalUser();
  }
}
