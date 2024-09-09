import { HttpStatus } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { BaseExceptionAbstract } from '~common/exceptions';

export class PrismaException extends BaseExceptionAbstract {
  constructor(
    error:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientValidationError
      | Prisma.PrismaClientRustPanicError
      | Prisma.PrismaClientUnknownRequestError
      | Prisma.PrismaClientInitializationError,
  ) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, {
      cause: error,
    });
  }
}
