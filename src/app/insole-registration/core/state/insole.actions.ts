export class ClearInsoleError{
  static readonly type = '[collection] clear error';
}

export class UpdateInsoleError{
  constructor(public error: any) {}

  static readonly type = '[item] Update error';
}
