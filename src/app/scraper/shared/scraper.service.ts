import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductDTO} from "../../shared/dto/product.dto";
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ScraperService {

  constructor(private http: HttpClient) { }

  public scrap(username: string, password: string): Observable<any> {
    return this.http.get<string>(environment.apiUrl + '/scrap?username=' + username + '&password=' + password);
  }

  public getProducts(): Observable<ProductDTO[]> {

    return this.http.get<ProductDTO[]>('http://localhost:3000/scraper/');

  }
}
