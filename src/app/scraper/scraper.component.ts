import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScraperService} from "./shared/scraper.service";
import {ExcelServicesService} from "./shared/excel-services.service";
import {ProductDTO} from "../shared/dto/product.dto";

@Component({
  selector: 'app-scraper',
  templateUrl: './scraper.component.html',
  styleUrls: ['./scraper.component.scss']
})
export class ScraperComponent implements OnInit {
  loginForm: FormGroup;
  test: any | undefined;
  hide = true;
  progressbar: boolean = false;
  scrapeBool = true;
  constructor(private formBuilder: FormBuilder, private scraperService: ScraperService, private excelService: ExcelServicesService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  scrap(): void {
   if(this.loginForm.invalid) {
     return;
   }
   this.progressbar = true;
   console.log(this.loginForm.value);
   this.scraperService.scrap(this.username?.value, this.password?.value).subscribe(status => {
     this.test = status
   });
   console.log(this.test);
   this.progressbar = false;
   this.username?.reset();
    this.password?.reset();
   this.scrapeBool = false;

  }

  downloadFile() {
    const products: ProductDTO[] = [];
    this.scraperService.getProducts().subscribe(data => {
      data.forEach(product => {
        product as ProductDTO;
        products.push(product);
      });
    });
    console.log(products);
    this.excelService.exportAsExcel(products, 'Products from Neskrid');
    this.scrapeBool = true;
  }
}
