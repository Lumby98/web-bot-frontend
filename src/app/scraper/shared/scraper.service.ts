import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductDTO} from "../../shared/dto/product.dto";
import {environment} from "../../../environments/environment";
import {LoginDto} from "../../shared/dto/login.dto";

@Injectable({
  providedIn: 'root'
})
export class ScraperService {

  constructor(private http: HttpClient) { }

  public scrap(loginDto: LoginDto): Observable<any> {
    return this.http.post<string>(environment.apiUrl + '/scraper/scrape', loginDto);
  }

  public getProducts(): Observable<ProductDTO[]> {

    return this.http.get<ProductDTO[]>(environment.apiUrl + '/scraper/');

  }
}
