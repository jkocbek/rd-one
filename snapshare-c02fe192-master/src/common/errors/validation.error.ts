import { BaseError } from '~common/errors/base.error';

export class ValidationError extends BaseError {
  constructor(readonly message: string) {
    super('NOT_VALID', message);
  }
}
