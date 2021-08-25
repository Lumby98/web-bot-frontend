import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScraperService} from "./shared/scraper.service";
import {ExcelServices} from "./shared/excel.service";
import {ProductDTO} from "../shared/dto/product.dto";
import {Status} from "../shared/enum/status.enum";

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
  constructor(private formBuilder: FormBuilder, private scraperService: ScraperService, private excelService: ExcelServices) {
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
   this.fillList();
   this.progressbar = false;
   this.username?.reset();
    this.password?.reset();
   this.scrapeBool = false;

  }

  products: ProductDTO[] = [];
  fillList()
  {
    this.scraperService.getProducts().subscribe(data => {
      for(const p of data) {
        this.products.push(p);
      }
    });
    console.log(this.products)
  }

  downloadFile() {
    /*const products: ProductDTO[] = [];
    this.scraperService.getProducts().subscribe(data => {
      for(const p of data) {
        products.push(p);
      }
    });*/
    console.log(this.products);
    this.excelService.exportAsExcel(this.products, 'Products from Neskrid');
    this.scrapeBool = true;
    this.products.filter(i => i.articleNo !== 'clear');
    console.log(this.products);
  }

}
