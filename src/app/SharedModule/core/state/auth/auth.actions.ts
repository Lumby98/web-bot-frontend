export class ClearError{
  static readonly type = '[collection] clear error';
}

export class UpdateError{
  constructor(public error: any) {}

  static readonly type = '[item] Update error';
}
