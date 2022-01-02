import {LogEntryDto} from "../../presentation/dto/log-entry.dto";

/**
 * action for updating the LogEntryStore
 */
export class UpdateLogEntryStore {
  constructor(public logEntries: LogEntryDto[]) {}
  static readonly type = '[LogEntry] Update logEntry'
}

/**
 * action that clears the logEntry store
 */
export class ClearLogEntryStore {
  static readonly type = '[LogEntry] Clear logEntry'
}

/**
 * action that inserts or updates a logEntry
 */
export class InsertOrUpdateLogEntry {
  constructor(public logEntry: LogEntryDto) {}
  static readonly type = '[LogEntry] InsertOrUpdate logEntry'
}

/**
 * action that deletes a logEntry
 */
export class DeleteLogEntry {
  constructor(public logEntry: LogEntryDto) {}
  static readonly type = '[LogEntry] delete logEntry'
}

/**
 * action that clears the logEntry error.
 */
export class ClearLogEntryError {
  static readonly type = '[error] clear logEntry error';
}

/**
 * action that updates the logEntry error.
 */
export class UpdateLogEntryError {
  constructor(public error: any) {}
  static readonly type = '[error] Update logEntry error';
}

/**
 * action that updates the logEntry count.
 */
export class UpdateLogEntryCount {
  constructor(public count: number) {}
  static readonly type = '[count] Update logEntry count';
}
