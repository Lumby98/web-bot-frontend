import { Injectable } from '@angular/core';
import {UserDto} from "../dto/user.dto";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  user: UserDto | undefined;

  constructor() { }
}
