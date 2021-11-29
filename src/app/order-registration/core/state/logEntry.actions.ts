import {UserDto} from "../../../user/core/models/user.dto";
import {LogEntryDto} from "../models/LogEntry.dto";

export class UpdateLogEntryStore{

  constructor(public users: UserDto[]) {}
  static readonly type = '[logEntry] Update logEntries'

}

export class ClearLogEntryStore{

  static readonly type = '[logEntry] Clear LogEntry'

}

export class InsertOrUpdateLogEntry{

  constructor(public logEntry: LogEntryDto) {}
  static readonly type = '[logEntry] InsertOrUpdate LogEntry'

}

export class DeleteUser{

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
