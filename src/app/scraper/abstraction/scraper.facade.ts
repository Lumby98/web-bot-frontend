import {Injectable} from "@angular/core";
import {Store} from "@ngxs/store";
import {Router} from "@angular/router";
import {ScraperService} from "../core/services/scraper.service";
import {ScraperState} from "../core/state/scraper.state";
import {ClearScraperError, UpdateScraperError} from "../core/state/scraper.actions";
import {Observable} from "rxjs";
import {HultaforsDto} from "../core/models/hultafors.dto";
import {NeskridDto} from "../core/models/neskrid.dto";
import {SiteDto} from "../core/models/site.dto";
import {ScrapeDto} from "../core/models/scrape.dto";
import {ReturnStrapeDto} from "../core/models/return-strape.dto";
import {ExcelServices} from "../../SharedModule/core/services/excel.service";


@Injectable()
export class ScraperFacade {
  constructor(private scraperService: ScraperService, private excel: ExcelServices, private store: Store, private router: Router) {
  }

  /**
   *
   */
  listenForError(): Observable<string>{
    return this.scraperService.listenForError();
  }

  /**
   *
   */
  getHultaforsProducts(): Observable<HultaforsDto[]> {
    return this.scraperService.getHultaforsProducts();
  }

  /**
   *
   */
  getNeskridProducts(): Observable<NeskridDto[]> {
    return this.scraperService.getNeskridProducts();

  }

  /**
   *
   */
  getSites() : Observable<SiteDto[]> {
    return this.scraperService.getSites();
  }

  /**
   *
   * @param dto
   */
   scrape(dto: ScrapeDto): Observable<any> {
    return this.scraperService.scrape(dto);

  }

  /**
   *
   * @param dto
   */
   listenForScrape(dto: ScrapeDto): Observable<ReturnStrapeDto> {
    return this.scraperService.listenForScrape(dto);
  }

  exportAsExcelNeskrid(json: any[], excelFileName: string): void {
     this.excel.exportAsExcelNeskrid(json,excelFileName);
  }

  exportAsExcelHultafos(products: any, excelFileName: string) {
    this.excel.exportAsExcelHultafos(products,excelFileName);
  }
  /**
   *
   */
  getError(): any {
    return this.store.selectOnce(ScraperState.error);
  }

  /**
   *
   */
  clearError() {
    this.store.dispatch(new ClearScraperError());
  }

  /**
   *
   * @param error
   */
  updateError(error: any) {
    this.store.dispatch(new UpdateScraperError(error));
  }


}
