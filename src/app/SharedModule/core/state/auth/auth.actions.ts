export class ClearError{
  static readonly type = '[collection] clear error';
}

export class UpdateError{
  constructor(public error: any) {}

  static readonly type = '[item] Update error';
}

export class ClearKey{
  static readonly type = '[key] clear key';
}

export class UpdateKey{
  constructor(public key: string) {}

  static readonly type = '[key] Update key';
}
