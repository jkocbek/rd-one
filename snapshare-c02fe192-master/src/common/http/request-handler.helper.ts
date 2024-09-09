import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import type { NextFunction, Response } from 'express';
import { getClientIp } from 'request-ip';
import type { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { getConfig } from '~common/config';
import { HttpConfig } from '~common/http/http.config';
import { logger } from '~common/logging';
import { RequestLogInterface } from '~common/logging/interfaces';

import { makeId } from '~utils/uuid';

import { HTTP_RESPONSE_API_REQUEST_ID_HEADER } from './http.constants';
import { ClientRequest } from './interfaces';

interface RequestContextInterface {
  requestId?: string;
  ipAddress?: string;
  requestRoute?: string;
  requestUrl?: string;
  userAgent?: string;
}

const httpConfig = getConfig(HttpConfig);

const requestStore = new AsyncLocalStorage<RequestContextInterface>();

export const HttpRequestContext = (): RequestContextInterface => {
  return requestStore.getStore() || {};
};

export function requestHandlerMiddleware(request: ClientRequest, response: Response, next: NextFunction) {
  const requestId = makeId();
  request.requestId = requestId;
  request.requestStart = process.hrtime();

  response.setHeader(HTTP_RESPONSE_API_REQUEST_ID_HEADER, requestId);

  requestStore.run(
    {
      requestId,
      ipAddress: getClientIp(request) || undefined,
      requestUrl: request.url,
      userAgent: request.get('User-Agent'),
    },
    () => {
      /**
       *  Log the request before it starts
       *    this might show requests that take a long time
       */
      if (httpConfig.log) {
        logger.extra({ context: 'HttpRequest', severity: 'verbose', extra: requestToLoggerExtra(request) });
      }

      next();
    },
  );
}

@Injectable()
export class RequestHandlerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const ctx = HttpRequestContext();
    if (ctx && request.route) {
      ctx.requestRoute = request.route.path;
    }

    if (httpConfig.log) {
      return next.handle().pipe(
        // this will not get called on errors, @see exceptionHandler
        tap(() => {
          logger.extra({ context: 'HttpRequest', severity: 'log', extra: requestToLoggerExtra(request, response) });
        }),
      );
    }
    return next.handle();
  }
}

export function requestToLoggerExtra(request: ClientRequest, response?: Response) {
  const data: RequestLogInterface = {
    remoteIp: getClientIp(request) || undefined,
    requestUrl: `${request.method}:${request.originalUrl}`,
  };

  if (request.route) {
    data.requestRoute = `${request.method}:${request.route?.path}`;
  }

  if (request.userId) {
    data.userId = request.userId;
  }

  if (response && request.requestStart) {
    const end = process.hrtime(request.requestStart);
    data.responseTime = +((end[0] * 1e9 + end[1]) / 1000000).toFixed(2);
    data.responseCode = response.statusCode;
  }

  return data;
}
