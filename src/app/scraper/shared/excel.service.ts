import { Injectable } from '@angular/core';
import * as XLSX from 'XLSX';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelServices {
  constructor() { }

  /**
   * creates excel file
   * @param json
   * @param excelFileName
   */
  public exportAsExcel(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: "xlsx", type: "array"});
    ExcelServices.saveAsExcelFile(excelBuffer, excelFileName);
  }

  /**
   * saves the file on the users computer
   * @param buffer
   * @param fileName
   * @private
   */
  private static saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
  }
}
