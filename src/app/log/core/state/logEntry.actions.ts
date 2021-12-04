import {LogEntryDto} from "../../presentation/dto/log-entry.dto";

export class UpdateLogEntryStore {
  constructor(public logEntries: LogEntryDto[]) {}
  static readonly type = '[LogEntry] Update logEntry'
}

export class ClearLogEntryStore {
  static readonly type = '[LogEntry] Clear logEntry'
}

export class InsertOrUpdateLogEntry {
  constructor(public logEntry: LogEntryDto) {}
  static readonly type = '[LogEntry] InsertOrUpdate logEntry'
}

export class DeleteLogEntry {
  constructor(public logEntry: LogEntryDto) {}
  static readonly type = '[LogEntry] delete logEntry'
}

export class ClearLogEntryError {
  static readonly type = '[LogEntry] clear logEntry error';
}

export class UpdateLogEntryError {
  constructor(public error: any) {}
  static readonly type = '[LogEntry] Update logEntry error';
}
