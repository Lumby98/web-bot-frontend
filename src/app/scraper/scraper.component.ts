import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScraperService} from "./shared/scraper.service";
import {ExcelServices} from "../shared/service/excel.service";
import {ScrapeDto} from "../shared/dto/scrape.dto";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";
import {HultaforsDto} from "../shared/dto/hultafors.dto";
import {SiteDto} from "../shared/dto/site.dto";
import {MatSelectChange} from "@angular/material/select";

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
  selectedSite: SiteDto| undefined;

  constructor(private formBuilder: FormBuilder,
              private scraperService: ScraperService,
              private excelService: ExcelServices) {
    this.hide = true
    this.scraperForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      site: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.errorSubscription = this.scraperService.listenForError().subscribe(err => {
      this.error = err;
      this.progressbar = false;});
    this.scraperService.getHultaforsProducts().pipe(take(1)).subscribe(products => {
      for (const p of products) {
        this.data.push(p);
      }
    });
    this.scraperService.getSites().pipe(take(1)).subscribe( sites => {
      for (const s of sites) {
        this.sites.push(s);
      }
      if (this.sites.length < 1) {
        this.sites = [{name: 'Hultafors', lastScraped: 'N/A'}, {name: 'Neskrid', lastScraped: 'N/A'}];
      }
    })
  }

  get username() { return this.scraperForm.get('username'); }
  get password() { return this.scraperForm.get('password'); }

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
     //checks if the from is valid
     if(this.scraperForm.invalid || !this.selectedSite) {
       throw new Error('missing information');
     }

     this.progressbar = true;
     const dto: ScrapeDto = {
       username: this.username?.value,
       password: this.password?.value,
       website: this.selectedSite.name
     }
     //calls the scraper service to contact the backend
     this.scraperService.listenForScrape(dto).pipe(take(1)).subscribe(status => {
       this.succes = status.message;
       if(status.sites.length < 2) {
         let updateSite = this.sites.find(e => e.name === status.sites[0].name);
         if (updateSite) {
           let index = this.sites.indexOf(updateSite);
           this.sites[index] = status.sites[0];
         }
       } else {
         this.sites = status.sites;
       }
       if(dto.website == 'Hultafors') {
         this.scraperService.getHultaforsProducts().pipe(take(1)).subscribe(products => {
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
     this.username?.reset();
     this.password?.reset();
   } catch (err) {
     this.error = err.message;
     this.progressbar = false;
   }
  }

  /**
   * gets a list of products
   */
  fillList()
  {
    if (!this.selectedSite) {
      throw new Error('Please select which source you want to get data from')
    }

    if (this.selectedSite.name == 'Neskrid') {
      this.scraperService.getNeskridProducts().pipe(take(1)).subscribe(data => {
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
      this.excelService.exportAsExcelNeskrid(products, 'Products from Neskrid');
    } else {
      this.excelService.exportAsExcelHultafos(products, 'Products from Hultafors');
    }
  }

  /**
   * clears error message
   */
  clearError() {
    this.error = undefined;
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
