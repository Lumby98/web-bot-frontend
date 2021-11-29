import {LogEntryDto} from "../models/LogEntry.dto";
import {ProcessStepDto} from "../models/processStep.dto";

export class UpdateLogEntryStore{
  constructor(public logEntries: LogEntryDto[]) {}
  static readonly type = '[logEntry] Update logEntries'
}

export class ClearLogEntryStore{
  static readonly type = '[logEntry] Clear LogEntry'
}

export class InsertOrUpdateLogEntry{
  constructor(public logEntry: LogEntryDto) {}
  static readonly type = '[logEntry] InsertOrUpdate LogEntry'
}

export class DeleteLogEntry{
  constructor(public logEntry: LogEntryDto) {}
  static readonly type = '[logEntry] delete LogEntry'
}

export class ClearLogEntryError{
  static readonly type = '[logEntry] clear logEntry error';
}

export class UpdateLogEntryError{
  constructor(public error: any) {}
  static readonly type = '[logEntry] Update logEntry error';
}

export class UpdateProcessStep{
  constructor(public processStepDto: ProcessStepDto) {}
    static readonly type = '[ProcessStep] Update ProcessStep';
}

export class clearProcessSteps{
  static readonly type = '[ProcessStep] Clear ProcessSteps';
}
