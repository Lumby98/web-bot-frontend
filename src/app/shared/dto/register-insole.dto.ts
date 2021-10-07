import {InsoleFromSheetDto} from "./insole-from-sheet.dto";

export interface RegisterInsoleDto {
  username: string,
  password: string,
  insoles: InsoleFromSheetDto[]
}
