import { Catch, ArgumentsHost, HttpException, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { instanceToPlain } from 'class-transformer';
import type { Response } from 'express';

import { getConfig } from '~common/config';
import { BaseExceptionAbstract, HttpResponseDetails } from '~common/exceptions/base-exception';
import { HttpConfig } from '~common/http/http.config';
import { ClientRequest } from '~common/http/interfaces';
import { requestToLoggerExtra } from '~common/http/request-handler.helper';
import { logger } from '~common/logging';

import { StatusResponseDto } from './dtos/status-response.dto';

const httpConfig = getConfig(HttpConfig);

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<ClientRequest>();

    const response = ctx.getResponse<Response>();

    let httpStatus: HttpStatus = 500;
    let statusResponse: StatusResponseDto;

    if (exception instanceof HttpException) {
      httpStatus = exception.getStatus();
      if (exception instanceof BaseExceptionAbstract) {
        statusResponse = new StatusResponseDto({
          code: exception.code || 'unknown-exception',
          message: exception.message,
          meta: exception.meta,
          detail: exception.detail,
        });
        logger.extra({
          context: 'BaseException',
          severity: exception.severity || 'error',
          extra: httpConfig.log ? undefined : requestToLoggerExtra(request, response),
          error: exception,
        });
      } else {
        httpStatus = exception.getStatus();
        statusResponse = new StatusResponseDto({
          code: `http-${httpStatus}`,
          message: HttpResponseDetails[httpStatus].message,
          detail: exception.message,
        });
        logger.extra({
          context: 'HttpException',
          severity: HttpResponseDetails[httpStatus].logLevel,
          extra: httpConfig.log ? undefined : requestToLoggerExtra(request, response),
          error: exception,
        });
      }
    } else {
      // unhandled exception
      logger.extra({ message: exception.message, context: 'HttpUncaught', severity: 'error', error: exception });
      statusResponse = new StatusResponseDto({
        code: 'uncaught-exception',
        message: 'Uncaught Exception',
      });
    }

    if (!response.headersSent) {
      response.status(httpStatus);
      response.json(instanceToPlain(statusResponse, { excludeExtraneousValues: true }));
    }

    if (httpConfig.log) {
      // Log the request
      //  because RequestLogInterceptor is not called when handling errors
      logger.extra({ context: 'HttpRequest', severity: 'log', extra: requestToLoggerExtra(request, response) });
    }
  }
}
