import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScraperService} from "./shared/scraper.service";
import {ExcelServices} from "./shared/excel.service";
import {ProductDTO} from "../shared/dto/product.dto";
import {LoginDto} from "../shared/dto/login.dto";

@Component({
  selector: 'app-scraper',
  templateUrl: './scraper.component.html',
  styleUrls: ['./scraper.component.scss']
})
export class ScraperComponent implements OnInit {
  loginForm: FormGroup;
  error: any | undefined;
  progressbar: boolean = false;
  scrapeBool = true;
  Sites: any = ['neskrid', 'other...'];
  hide: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private scraperService: ScraperService,
    private excelService: ExcelServices)
  {
    this.hide = true
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      site: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }
  get site() {return this.loginForm.get('site'); }

  scrape(): void {

   try {
     if(this.loginForm.invalid) {
       throw new Error('missing information');
     }
     const site = this.site?.value;
     this.progressbar = true;
     const dto: LoginDto = {username: this.username?.value, password: this.password?.value}
     this.scraperService.scrap(dto).subscribe(status => {
       this.error = status.message;
       this.progressbar = false;
       console.log(status);
     });
     console.log(this.error);
     this.username?.reset();
     this.password?.reset();
     this.scrapeBool = false;
   } catch (err) {
     this.error = err.message;
     this.progressbar = false;
   }
  }

  fillList()
  {
    this.scraperService.getProducts().subscribe(data => {
      const products = []
      for(const p of data) {
        products.push(p);
      }
      this.downloadFile(products);
    });

  }

  downloadFile(products: ProductDTO[]) {
    console.log(products);
    this.excelService.exportAsExcel(products, 'Products from Neskrid');
    this.scrapeBool = true;
    console.log(products);
  }

  clearError() {
    this.error = undefined;
  }
}
