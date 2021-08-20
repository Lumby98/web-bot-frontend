import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ScraperService {

  constructor(private http: HttpClient) { }

  scrap(username: string, password: string): Observable<string> {
    return this.http.get<string>('http://localhost:3000/scrap?username=' + username + '&password=' + password);
  }
}
