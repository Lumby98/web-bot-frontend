import {LogEntryDto} from "../../../SharedModule/core/models/LogEntry.dto";
import {ProcessStepDto} from "../models/processStep.dto";

export class UpdateOrderRegLogEntryStore {
  constructor(public logEntries: LogEntryDto[]) {}
  static readonly type = '[OrderRegLogEntry] Update OrderRegLogEntries'
}

export class ClearOrderRegLogEntryStore {
  static readonly type = '[OrderRegLogEntry] Clear OrderRegLogEntry'
}

export class InsertOrUpdateOrderRegLogEntry {
  constructor(public logEntry: LogEntryDto) {}
  static readonly type = '[OrderRegLogEntry] InsertOrUpdate OrderRegLogEntry'
}

export class DeleteOrderRegLogEntry {
  constructor(public logEntry: LogEntryDto) {}
  static readonly type = 'OrderReg[logEntry] delete OrderRegLogEntry'
}

export class ClearOrderRegLogEntryError {
  static readonly type = '[OrderRegLogEntry] clear OrderRegLogEntry error';
}

export class UpdateOrderRegLogEntryError {
  constructor(public error: any) {}
  static readonly type = '[OrderRegLogEntry] Update OrderRegLogEntry error';
}

export class UpdateProcessStep{
  constructor(public processStepDto: ProcessStepDto) {}
    static readonly type = '[ProcessStep] Update ProcessStep';
}

export class clearProcessSteps{
  static readonly type = '[ProcessStep] Clear ProcessSteps';
}
