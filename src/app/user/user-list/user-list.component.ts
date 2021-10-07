import {Component, OnInit,} from '@angular/core';
import {UserDto} from "../../shared/dto/user.dto";
import {UserService} from "../shared/user.service";
import {take} from "rxjs/operators";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  typeofUsers: UserDto[] | undefined
  currentUser: UserDto | undefined

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userService.getUsers().pipe(take(1)).subscribe( succes => {
      this.typeofUsers = succes;
    });

    const u = localStorage.getItem('currentUser');
    if(u) {
      const m = JSON.parse(u);
      this.currentUser = m.body;
    }
  }

  /**
   * navigates to user-detail for the chosen user
   * @param user
   */
  goToUser(user: UserDto) {
    this.router.navigate(['/user-detail']);
  }
}
