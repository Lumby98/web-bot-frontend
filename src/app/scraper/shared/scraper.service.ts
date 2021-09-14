import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {NeskridDto} from "../../shared/dto/neskrid.dto";
import {environment} from "../../../environments/environment";
import {ScrapeDto} from "../../shared/dto/scrape.dto";
import {LoginDto} from "../../shared/dto/login.dto";
import {catchError, map, timeout} from "rxjs/operators";
import {Socket} from "ngx-socket-io";
import {HultaforsDto} from "../../shared/dto/hultafors.dto";

@Injectable({
  providedIn: 'root'
})
export class ScraperService {
  timeout = 300000; //5min in milliseconds

  constructor(private http: HttpClient, private socket: Socket) { }

  /**
   * contacts the backend to start scraping with http requests
   * @param dto
   */
  public scrape(dto: ScrapeDto): Observable<any> {
    try {
      return this.http
        .post(
          environment.apiUrl + '/scraper/scrape', dto,
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

  /**
   * contacts the backend to start scraping with socket communication
   * @param dto
   */
  public listenForScrape(dto: ScrapeDto): Observable<string> {
    this.socket.emit('startScrape', dto);

    return this.socket.fromEvent<string>('completedScrape');
  }

  /**
   * socket event listing for error messages
   */
  public listenForError(): Observable<string> {
    return this.socket.fromEvent<string>('error')
  }

  /**
   * get all products for Neskrid
   */
  public getNeskridProducts(): Observable<NeskridDto[]> {

    return this.http
      .get<NeskridDto[]>(
        environment.apiUrl + '/scraper/neskrid',
        {withCredentials: true});

  }

  /**
   * get all products for hultafors
   */
  public getHultaforsProducts(): Observable<HultaforsDto[]> {

    return this.http.get<HultaforsDto[]>(
      environment.apiUrl + '/scraper/hultafors',
      {withCredentials: true}
    )
  }
}
