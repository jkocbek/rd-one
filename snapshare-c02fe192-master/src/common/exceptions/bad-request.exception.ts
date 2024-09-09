import { HttpStatus } from '@nestjs/common';

import { BaseExceptionAbstract } from './base-exception';

export class BadRequestException extends BaseExceptionAbstract {
  constructor(message: string, code: string, status = HttpStatus.BAD_REQUEST) {
    super(status, { message, code });
  }
}
