import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PaginationDto} from "../../../SharedModule/presentation/dto/filter/pagination-dto";
import {QueryDto} from "../../../SharedModule/presentation/dto/filter/query.dto";
import {LogEntryDto} from "../../presentation/dto/log-entry.dto";
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class LogService {

  constructor(private http: HttpClient) {
  }

  findAll(query: QueryDto): Promise<PaginationDto<LogEntryDto>> {
   const url = environment.apiUrl + '/log' + '?'
    if (query && query.take > 0 && query. > 0)
    {
      url = url
        + 'ItemsPrPage=' + filter.itemsPrPage
        + '&CurrentPage=' + filter.currentPage + '&';
    }
    if (filter && filter.searchField?.length > 0)
    {
      url = url
        + 'searchField=' + filter.searchField
        + '&searchText=' + filter.searchText + '&';
    }
    if (filter && filter.searchField2?.length > 0)
    {
      url = url
        + 'searchField2=' + filter.searchField2
        + '&searchText2=' + filter.searchText2 + '&';
    }
  }


  remove(id: number) {}

  removeAll() {}
}
