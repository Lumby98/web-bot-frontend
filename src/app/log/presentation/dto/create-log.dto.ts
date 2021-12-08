import {ProcessStepEnum} from "../../../order-registration/core/enums/processStep.enum";
import {CreateLogOrderDto} from "./create-log-order.dto";
import {CreateOrderErrorDto} from "./create-order-error.dto";


export interface CreateLogDto {
  status: boolean;
  process: ProcessStepEnum;
  timestamp: Date;
  order: CreateLogOrderDto;
  error?: CreateOrderErrorDto;
}
