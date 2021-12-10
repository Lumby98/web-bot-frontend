import {ProcessEnum} from "../enums/process.enum";

export interface OrderProcessDto {
  orderNumber: string;
  process: ProcessEnum;
}
