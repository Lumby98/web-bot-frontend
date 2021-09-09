import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {ProductDTO} from "../../shared/dto/product.dto";
import {environment} from "../../../environments/environment";
import {ScrapeDto} from "../../shared/dto/scrape.dto";
import {LoginDto} from "../../shared/dto/login.dto";
import {catchError, map, timeout} from "rxjs/operators";
import {Socket} from "ngx-socket-io";

@Injectable({
  providedIn: 'root'
})
export class ScraperService {
  timeout = 300000; //5min in milliseconds

  constructor(private http: HttpClient, private socket: Socket) { }

  public scrape(loginDto: LoginDto): Observable<any> {
    try {
      return this.http
        .post(
          environment.apiUrl + '/scraper/scrape', loginDto,
          {withCredentials: true}
        )
        .pipe(
          timeout(this.timeout),
          map(response => {
            return response
          }),
          catchError(() => {
            throw new Error('timeout exceed, im still getting the data,' +
              ' but i cannot tell you when im done')
          })
        );
    } catch (err) {
      throw new Error(err);
    }

  }

  public listenForScrape(loginDto: LoginDto): Observable<string> {
    this.socket.emit('startScrape', loginDto);

    return this.socket.fromEvent<string>('completedScrape');
  }

  public listenForError(): Observable<string> {
    return this.socket.fromEvent<string>('error')
  }

  public getProducts(): Observable<ProductDTO[]> {

    return this.http
      .get<ProductDTO[]>(
        environment.apiUrl + '/scraper/',
        {withCredentials: true});

  }
}
