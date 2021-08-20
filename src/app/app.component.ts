import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'web-bot-frontend';
  constructor(private router: Router) {
  }
  toScraper() {
    this.router.navigate(['/scraper']);
  }

  toHome() {
    this.router.navigate(['/']);
  }
}
