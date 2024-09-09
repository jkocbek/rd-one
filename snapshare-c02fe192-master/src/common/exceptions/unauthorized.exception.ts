import { HttpStatus } from '@nestjs/common';

import { BaseExceptionAbstract } from './base-exception';

export class UnauthorizedException extends BaseExceptionAbstract {
  constructor(message: string, code: string, status = HttpStatus.UNAUTHORIZED) {
    super(status, { message, code });
  }
}
