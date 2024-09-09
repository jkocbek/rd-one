import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';

import { ValidationError } from '~common/errors/validation.error';

@Catch(ValidationError)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: ValidationError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(HttpStatus.BAD_REQUEST).json({
      httpStatus: HttpStatus.BAD_REQUEST,
      code: exception.errorCode,
      message: 'Validation exception',
      detail: exception.message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
