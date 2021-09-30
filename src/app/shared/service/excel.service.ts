import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import {InsoleFromSheetDto} from "../dto/insole-from-sheet.dto";
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
@Injectable({
  providedIn: 'root'
})
export class ExcelServices {
  constructor() {}

  /**
   * creates excel file from a list of Neskrid products
   * @param json
   * @param excelFileName
   */
  public exportAsExcelNeskrid(json: any[], excelFileName: string): void {
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
    const date: string = new Date().toLocaleDateString();
    FileSaver.saveAs(data, fileName + '_export_' + date + EXCEL_EXTENSION);
  }

  /**
   * creates excel file from a list of Hultafors products
   * @param products
   * @param excelFileName
   */
  exportAsExcelHultafos(products: any, excelFileName: string) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.table_to_sheet(products);
    const workbook: XLSX.WorkBook = {Sheets: {'data': worksheet}, SheetNames: ['data']};
    const excelBuffer: any = XLSX.write(workbook, {bookType: "xlsx", type: "binary"});
    const binary = ExcelServices.convertToBinary(excelBuffer);
    ExcelServices.saveAsExcelFile(binary, excelFileName);
  }


  /**
   * converts an xlsx workbook to binary
   * @param excelBuffer
   * @private
   */
  private static convertToBinary(excelBuffer: any) {
    const buf = new ArrayBuffer(excelBuffer.length);
    const view = new Uint8Array(buf);
    for (let i=0; i<excelBuffer.length; i++) {
      view[i] = excelBuffer.charCodeAt(i) & 0xFF;
    }
    return buf;
  }

  /**
   * gets data from an uploaded excel sheet and returns list of orders
   * @param fileToUpload
   */
  fileUpload(fileToUpload: File) {
    let fileReader = new FileReader();
    fileReader.onload = () => {
      let arrayBuffer: any;
      arrayBuffer = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = [];
      for (let i = 0; i != data.length; ++i) {
        arr[i] = String.fromCharCode(data[i]);
      }
      const bsrt = arr.join('');
      const workbook = XLSX.read(bsrt, {type: "binary"});
      const first_sheet_name = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[first_sheet_name];
      const fileArr = XLSX.utils.sheet_to_json(worksheet, {raw: true});
      fileArr.length = fileArr.length - 9;
      fileArr.shift();
      fileArr.shift();
      let insoles: InsoleFromSheetDto[] = [];
      Object.assign(insoles, JSON.parse(JSON.stringify(fileArr)));
      console.log(fileArr);
      console.log('insoles');
      console.log(insoles);
    }
    fileReader.readAsArrayBuffer(fileToUpload);
  }
}
