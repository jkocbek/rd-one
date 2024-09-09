import { DynamicModule, Logger, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import {
  AuthManagedCustomProviderEmailPasswordConfig,
  IAuthManagedCustomProviderEmailPasswordConfig,
} from './auth-managed-custom-provider-email-password.config';
import { AuthManagedCustomProviderEmailPasswordService } from './auth-managed-custom-provider-email-password.service';

@Module({})
export class AuthManagedCustomProviderEmailPasswordModule {
  static forRoot(config: IAuthManagedCustomProviderEmailPasswordConfig): DynamicModule {
    return {
      module: AuthManagedCustomProviderEmailPasswordModule,
      providers: [
        plainToValidatedInstanceProvider(AuthManagedCustomProviderEmailPasswordConfig, config),
        {
          provide: AuthManagedCustomProviderEmailPasswordService.LOGGER_KEY,
          useValue: new Logger(AuthManagedCustomProviderEmailPasswordService.name),
        },
        AuthManagedCustomProviderEmailPasswordService,
      ],
      exports: [AuthManagedCustomProviderEmailPasswordService],
    };
  }
}
