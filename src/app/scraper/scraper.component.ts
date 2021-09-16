import {Component, OnInit, OnDestroy} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScraperService} from "./shared/scraper.service";
import {ExcelServices} from "./shared/excel.service";
import {ScrapeDto} from "../shared/dto/scrape.dto";
import {take} from "rxjs/operators";
import {Subscription} from "rxjs";
import {HultaforsDto} from "../shared/dto/hultafors.dto";

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
  sites: any = ['Neskrid', 'Hultafors'];
  selectedSite = '';

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
  }

  get username() { return this.scraperForm.get('username'); }
  get password() { return this.scraperForm.get('password'); }

  /**
   * gets the selected value of the dropdown menu
   * @param event
   */
  selectChangeHandler (event: any) {
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
       website: this.selectedSite
     }
     //calls the scraper service to contact the backend
     this.scraperService.listenForScrape(dto).pipe(take(1)).subscribe(status => {
       this.succes = status;
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

    if (this.selectedSite == 'Neskrid') {
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
    if (this.selectedSite == 'Neskrid') {
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
