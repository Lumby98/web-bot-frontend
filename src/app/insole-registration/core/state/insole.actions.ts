/**
 * Action for clearing the insole error.
 */
export class ClearInsoleError{
  static readonly type = '[collection] clear error';
}

/**
 * Action for updating the insole error
 */
export class UpdateInsoleError{
  constructor(public error: any) {}

  static readonly type = '[item] Update error';
}
