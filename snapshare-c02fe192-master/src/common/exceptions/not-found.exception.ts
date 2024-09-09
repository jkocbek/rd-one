import { HttpStatus } from '@nestjs/common';

import { BaseExceptionAbstract } from './base-exception';

export class NotFoundException extends BaseExceptionAbstract {
  constructor(message: string, code: string, status = HttpStatus.NOT_FOUND) {
    super(status, { message, code });
  }
}
