import { OrderLogModel } from './order-log.model';
import { ErrorLogModel } from './error-log.model';
import {ProcessStepEnum} from "../../../order-registration/core/enums/processStep.enum";

export interface LogModel {
  id: number;
  status: boolean;
  process: ProcessStepEnum;
  timestamp: Date;
  order: OrderLogModel;
  error?: ErrorLogModel;
}
