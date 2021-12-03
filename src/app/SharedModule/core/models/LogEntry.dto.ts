import {LogOrderDto} from "./logOrder.dto";

export interface LogEntryDto {
  id: number;
  status: boolean;
  process: string;
  timestamp: Date;
  order: LogOrderDto;
}
