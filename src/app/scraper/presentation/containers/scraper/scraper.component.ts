import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScraperService} from "../../../core/services/scraper.service";
import {ExcelServices} from "../../../../SharedModule/core/services/excel.service";
import {ScrapeDto} from "../../../core/models/scrape.dto";
import {take, takeUntil} from "rxjs/operators";
import {Observable, Subscription} from "rxjs";
import {HultaforsDto} from "../../../core/models/hultafors.dto";
import {SiteDto} from "../../../core/models/site.dto";
import {MatSelectChange} from "@angular/material/select";
import {ScraperFacade} from "../../../abstraction/scraper.facade";
import {AuthFacade} from "../../../../SharedModule/abstraction/auth.facade";

@Component({
  selector: 'app-scraper',
  templateUrl: './scraper.component.html',
  styleUrls: ['./scraper.component.scss']
})
export class ScraperComponent implements OnInit, OnDestroy {
  scraperForm: FormGroup;
  error: any | undefined;
  succes: any | undefined;
  progressbar: boolean = false;
  hide: boolean;
  hidden: boolean = true;
  errorSubscription: Subscription | undefined;
  data: HultaforsDto[] = [];
  sites: SiteDto[] = [];
  selectedSite: SiteDto | undefined;
  currentKey$: Observable<string>;

  constructor(private formBuilder: FormBuilder,
              private scraperFacade: ScraperFacade,
              private authFacade: AuthFacade,
  ) {
    this.hide = true
    this.scraperForm = this.formBuilder.group({
      site: ['', Validators.required]
    });
    this.currentKey$ = this.authFacade.getCurrentKey();
  }

  ngOnInit(): void {

    this.errorSubscription = this.scraperFacade.listenForError().subscribe(err => {
      this.error = err;
      this.progressbar = false;
    });


    this.scraperFacade.getHultaforsProducts().pipe(take(1)).subscribe(products => {
      for (const p of products) {
        this.data.push(p);
      }
    });

    this.scraperFacade.getSites().pipe(take(1)).subscribe(sites => {
      for (const s of sites) {
        this.sites.push(s);
      }
      if (this.sites.length < 1) {
        this.sites = [{name: 'Hultafors', lastScraped: 'N/A'}, {name: 'Neskrid', lastScraped: 'N/A'}];
      } else if (this.sites.length == 1) {
        if (this.sites.find(site => site.name == 'Hultafors')) {
          const neskrid: SiteDto = {name: 'Neskrid', lastScraped: 'N/A'};
          this.sites.push(neskrid);

        } else {
          const hultafors: SiteDto = {name: 'Hultafors', lastScraped: 'N/A'};
          this.sites.push(hultafors);
        }
      }


    })
  }

  /**
   * gets the selected value of the dropdown menu
   * @param event
   */
  selectChangeHandler(event: MatSelectChange) {
    this.selectedSite = event.value;
  }

  /**
   * start scraping
   */
  scrape() {
    try {
      this.currentKey$.pipe(take(1)).subscribe(key => {
        if (key) {

          //checks if the from is valid
          if (this.scraperForm.invalid || !this.selectedSite) {
            throw new Error('missing information');
          }

          this.progressbar = true;
          const dto: ScrapeDto = {
            key: key,
            website: this.selectedSite.name
          }
          //calls the scraper services to contact the backend
          this.scraperFacade.listenForScrape(dto).pipe(take(1)).subscribe(status => {
            this.succes = status.message;
            if (status.sites.length < 2) {
              let updateSite = this.sites.find(e => e.name === status.sites[0].name);
              if (updateSite) {
                let index = this.sites.indexOf(updateSite);
                this.sites[index] = status.sites[0];
              }
            } else {
              this.sites = status.sites;
            }
            if (dto.website == 'Hultafors') {
              this.scraperFacade.getHultaforsProducts().pipe(take(1)).subscribe(products => {
                for (const p of products) {
                  this.data.push(p);
                }
              });
            }
            this.progressbar = false;
          }, error => {
            this.error = error.message;
            this.progressbar = false;
            throw Error(error);
          });

        } else {
          this.error = 'Could not get key';
          this.progressbar = false;
          throw Error(this.error);
        }


      }, error => {
        this.error = error.message;
        this.progressbar = false;
        throw Error(error);
      });

    } catch (err) {
      this.error = err.message;
      this.progressbar = false;
    }
  }

  /**
   * gets a list of products
   */
  fillList() {
    if (!this.selectedSite) {
      throw new Error('Please select which source you want to get data from')
    }

    if (this.selectedSite.name == 'Neskrid') {
      this.scraperFacade.getNeskridProducts().pipe(take(1)).subscribe(data => {
        const products = [];
        for (const p of data) {
          products.push(p);
        }
        this.downloadFile(products);
      });
    } else {
      const table = document.getElementById("hultaforsTable");
      this.downloadFile(table);

    }

  }

  /**
   * creates an excel file to download
   * @param products
   */
  downloadFile(products: any) {
    if (this.selectedSite?.name == 'Neskrid') {
      this.scraperFacade.exportAsExcelNeskrid(products, 'Products from Neskrid');
    } else {
      this.scraperFacade.exportAsExcelHultafos(products, 'Products from Hultafors');
    }
  }

  /**
   * clears error message
   */
  clearError() {
    this.error = undefined;
    this.scraperFacade.clearError();
  }

  /**
   * clears succes message
   */
  clearSucces() {
    this.succes = undefined;
  }

  ngOnDestroy(): void {
    this.errorSubscription?.unsubscribe();
  }
}
