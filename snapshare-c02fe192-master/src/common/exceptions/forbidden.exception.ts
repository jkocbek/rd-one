import { HttpStatus } from '@nestjs/common';

import { BaseExceptionAbstract } from './base-exception';

export class ForbiddenException extends BaseExceptionAbstract {
  constructor(message: string, code: string, status = HttpStatus.FORBIDDEN) {
    super(status, { message, code });
  }
}
