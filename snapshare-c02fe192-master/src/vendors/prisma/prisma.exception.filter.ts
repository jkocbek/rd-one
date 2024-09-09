import { Catch, ConflictException, ExceptionFilter, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

import { logger } from '~common/logging';

import { PrismaException } from './exceptions/prisma.exception';

@Catch(
  Prisma.PrismaClientKnownRequestError,
  Prisma.PrismaClientValidationError,
  Prisma.PrismaClientRustPanicError,
  Prisma.PrismaClientUnknownRequestError,
  Prisma.PrismaClientInitializationError,
)
export class PrismaExceptionFilter
  implements
    ExceptionFilter<
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientValidationError
      | Prisma.PrismaClientRustPanicError
      | Prisma.PrismaClientUnknownRequestError
      | Prisma.PrismaClientInitializationError
    >
{
  catch(
    e:
      | Prisma.PrismaClientKnownRequestError
      | Prisma.PrismaClientValidationError
      | Prisma.PrismaClientRustPanicError
      | Prisma.PrismaClientUnknownRequestError
      | Prisma.PrismaClientInitializationError,
  ) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // All PrismaClientKnownRequestError can be found here: https://www.prisma.io/docs/reference/api-reference/error-reference#error-codes
      if (e.code === 'P2002') {
        throw new ConflictException(`Entity with this '${e.meta?.target}' already exists.`);
      } else if (e.code === 'P2025') {
        throw new NotFoundException(e.message);
      }
    }

    let extra: Record<string, any> = {};

    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      extra = {
        code: e.code,
        meta: e.meta,
      };
    }

    logger.extra({
      context: 'PrismaORM',
      severity: 'error',
      message: e.message,
      extra,
    });

    throw new PrismaException(e);
  }
}
