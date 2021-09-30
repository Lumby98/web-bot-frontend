import { Component, OnInit } from '@angular/core';
import {ExcelServices} from "../shared/service/excel.service";

@Component({
  selector: 'app-insole-registration',
  templateUrl: './insole-registration.component.html',
  styleUrls: ['./insole-registration.component.scss']
})
export class InsoleRegistrationComponent implements OnInit {

  constructor(private excelService: ExcelServices) {
  }

  ngOnInit(): void {
  }

  excelInputChange(fileEvent: any) {
    const file = fileEvent.target.files[0]
    if (!file) {
      throw new Error('No selected file')
    }
    this.excelService.fileUpload(file);
  }
}
