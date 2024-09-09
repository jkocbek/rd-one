import { HttpStatus } from '@nestjs/common';

import { BaseExceptionAbstract } from './base-exception';

export class InternalServerErrorException extends BaseExceptionAbstract {
  constructor(message: string, code: string, status = HttpStatus.INTERNAL_SERVER_ERROR) {
    super(status, { message, code });
  }
}
