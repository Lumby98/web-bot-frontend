import { Injectable } from '@angular/core';
import * as XLSX from 'XLSX';
import * as FileSaver from 'file-saver';
import {ProductDTO} from "../../shared/dto/product.dto";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelServicesService {
  constructor() { }

  public exportAsExcel(json: ProductDTO[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelbuffer: any = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
    this.saveAsExcelFile(excelbuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
