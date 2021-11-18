
export class ClearScraperError{
  static readonly type = '[error] clear error';
}

export class UpdateScraperError{
  constructor(public error: any) {}

  static readonly type = '[error] Update error';
}
