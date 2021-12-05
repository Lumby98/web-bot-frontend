import {ProcessStepEnum} from "../../../order-registration/core/enums/processStep.enum";
import {LogOrderDto} from "./log-order.dto";
import {OrderErrorDto} from "./order-error.dto";

export interface LogEntryDto {
  id: number;
  status: boolean;
  process: ProcessStepEnum;
  timestamp: Date;
  order: LogOrderDto;
  error?: OrderErrorDto;
}
