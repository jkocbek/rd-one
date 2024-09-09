import { DynamicModule, Logger, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import { IOpenidClientAwsCognitoConfig, OpenidClientAwsCognitoConfig } from './openid-client-aws-cognito.config';
import { OpenidClientAwsCognitoService } from './openid-client-aws-cognito.service';

@Module({})
export class OpenidClientAwsCognitoModule {
  static forRoot(config: IOpenidClientAwsCognitoConfig): DynamicModule {
    return {
      module: OpenidClientAwsCognitoModule,
      providers: [
        plainToValidatedInstanceProvider(OpenidClientAwsCognitoConfig, config),
        {
          provide: OpenidClientAwsCognitoService.LOGGER_KEY,
          useValue: new Logger(OpenidClientAwsCognitoService.name),
        },
        OpenidClientAwsCognitoService,
      ],
      exports: [OpenidClientAwsCognitoService],
    };
  }
}
