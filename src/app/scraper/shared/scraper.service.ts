import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductDTO} from "../../shared/dto/product.dto";
import {environment} from "../../../environments/environment";
import {map, timeout} from "rxjs/operators";
import {ScrapeDto} from "../../shared/dto/scrape.dto";

@Injectable({
  providedIn: 'root'
})
export class ScraperService {
  timeout = 300000; //5min in milliseconds

  constructor(private http: HttpClient) { }

  public scrap(scrapeDto: ScrapeDto): Observable<any> {
    return this.http
      .post<string>(
        environment.apiUrl + '/scraper/scrape', scrapeDto,
        {withCredentials: true}
      )
      .pipe(
        timeout(this.timeout),
        map(response => { return response} ),
      );
  }

  public getProducts(): Observable<ProductDTO[]> {

    return this.http
      .get<ProductDTO[]>(
        environment.apiUrl + '/scraper/',
        {withCredentials: true});

  }
}
