import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductDTO} from "../../shared/dto/product.dto";
import {environment} from "../../../environments/environment";
import {LoginDto} from "../../shared/dto/login.dto";
import {timeout} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ScraperService {
  timeout = 300000; //5min in milliseconds

  constructor(private http: HttpClient) { }

  public scrap(loginDto: LoginDto): Observable<any> {
    return this.http
      .post<string>(
        environment.apiUrl + '/scraper/scrape', loginDto,
        {withCredentials: true}
      )
      .pipe(
        timeout(this.timeout)
      );
  }

  public getProducts(): Observable<ProductDTO[]> {

    return this.http
      .get<ProductDTO[]>(
        environment.apiUrl + '/scraper/',
        {withCredentials: true});

  }
}
