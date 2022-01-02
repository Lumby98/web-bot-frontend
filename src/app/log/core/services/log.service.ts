import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PaginationDto} from "../../../SharedModule/presentation/dto/filter/pagination-dto";
import {QueryDto} from "../../../SharedModule/presentation/dto/filter/query.dto";
import {LogEntryDto} from "../../presentation/dto/log-entry.dto";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";
import {UpdateLogDto} from "../../presentation/dto/update-log.dto";

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) {
  }

  /**
   * calls the backend to get a list of paginated logEntries.
   * @param query
   */
  findAll(query: QueryDto): Observable<PaginationDto<LogEntryDto>> {
   let url = environment.apiUrl + '/log' + '?'
    if (query && query.take > 0 && query.page > 0)
    {
      url = url
        + 'take=' + query.take
        + '&page=' + query.page + '&';
    }
    if (query && query.keyword?.length > 0)
    {
      url = url
        + 'keyword=' + query.keyword + '&';
    }

    return this.http.get<PaginationDto<LogEntryDto>>(url, {withCredentials: true});

  }

  /**
   * calls the backend to delete a logEntry
   * @param id
   */
  remove(id: number) {
    return this.http
      .delete(
        environment.apiUrl + '/log/delete/' + id,
        {withCredentials: true});
  }

  /**
   * calls the backend to delete all logEntries.
   */
  removeAll() {
    return this.http
      .delete(
        environment.apiUrl + '/log/deleteAll',
        {withCredentials: true});
  }

  /**
   * calls the backend to update a logEntry
   * @param log
   */
  update(log: UpdateLogDto) {
    return this.http.patch(environment.apiUrl + '/log', log, {withCredentials: true})
  }
}
