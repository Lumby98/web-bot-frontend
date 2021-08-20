import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ScraperService} from "./shared/scraper.service";

@Component({
  selector: 'app-scraper',
  templateUrl: './scraper.component.html',
  styleUrls: ['./scraper.component.scss']
})
export class ScraperComponent implements OnInit {
  loginForm: FormGroup;
  test: string = '';
  constructor(private formBuilder: FormBuilder, private scraperService: ScraperService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

  scrap(): void {
   if(this.loginForm.invalid) {
     return;
   }
   console.log(this.loginForm.value);
   this.scraperService.scrap(this.username?.value, this.password?.value).subscribe(status => {
     this.test = status
   });
   console.log(this.test);

  }
}
