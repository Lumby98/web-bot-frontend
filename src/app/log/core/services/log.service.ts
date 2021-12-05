import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PaginationDto} from "../../../SharedModule/presentation/dto/filter/pagination-dto";
import {QueryDto} from "../../../SharedModule/presentation/dto/filter/query.dto";
import {LogEntryDto} from "../../presentation/dto/log-entry.dto";
import {environment} from "../../../../environments/environment";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) {
  }

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


  remove(id: number) {
    return this.http
      .delete(
        environment.apiUrl + '/log/delete/' + id,
        {withCredentials: true});
  }

  removeAll() {
    return this.http
      .delete(
        environment.apiUrl + '/log/deleteAll',
        {withCredentials: true});
  }
}
