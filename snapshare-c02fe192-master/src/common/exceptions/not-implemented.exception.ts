import { HttpStatus } from '@nestjs/common';

import { BaseExceptionAbstract } from './base-exception';

export class NotImplementedException extends BaseExceptionAbstract {
  constructor(message: string, code: string, status = HttpStatus.NOT_IMPLEMENTED) {
    super(status, { message, code });
  }
}
