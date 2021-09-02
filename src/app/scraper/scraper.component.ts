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
  test: any | undefined;
  progressbar: boolean = false;
  scrapeBool = true;
  products: ProductDTO[] = [];
  Sites: any = ['neskrid', 'other...'];
  constructor(private formBuilder: FormBuilder, private scraperService: ScraperService, private excelService: ExcelServices) {
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
   if(this.loginForm.invalid) {
     return;
   }
   const site = this.site?.value;
   this.progressbar = true;
   const dto: LoginDto = {username: this.username?.value, password: this.password?.value}
   this.scraperService.scrap(dto).subscribe(status => {
     this.test = status
   });
   console.log(this.test);
   this.fillList();
   this.progressbar = false;
   this.username?.reset();
    this.password?.reset();
   this.scrapeBool = false;
  }

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
    console.log(this.products);
    this.excelService.exportAsExcel(this.products, 'Products from Neskrid');
    this.scrapeBool = true;
    this.products = []
    console.log(this.products);
  }

}
