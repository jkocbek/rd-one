import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { ValidationException } from '~common/exceptions';
import { AllExceptionsFilter } from '~common/http/exception-response.helper';
import { RequestHandlerInterceptor, requestHandlerMiddleware } from '~common/http/request-handler.helper';
import { ValidationExceptionFilter } from '~common/http/validation.filter';

import { flatten } from '~vendors/class-validator';

export function globalPipes(app: INestApplication): void {
  app.use(requestHandlerMiddleware);
  app.useGlobalInterceptors(new RequestHandlerInterceptor());

  // serialise all class-validated dto's
  app.useGlobalInterceptors(
    //
    new ClassSerializerInterceptor(app.get(Reflector), { excludeExtraneousValues: true }),
  );

  // send exceptions as formatted  error messages
  app.useGlobalFilters(new AllExceptionsFilter(), new ValidationExceptionFilter());

  // validate request DTO with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // use DTOs as runtime types
      whitelist: true, // strip non-whitelisted
      // forbidNonWhitelisted: true, // throw on non-whitelisted
      exceptionFactory: (fieldErrors) => {
        return new ValidationException(flatten(fieldErrors));
      },
    }),
  );
}
