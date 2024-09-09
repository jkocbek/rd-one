import { DynamicModule, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import {
  AuthManagedSocialProviderGoogleConfig,
  IAuthManagedSocialProviderGoogleConfig,
} from './auth-managed-social-provider-google.config';
import { AuthManagedSocialProviderGoogleService } from './auth-managed-social-provider-google.service';

@Module({})
export class AuthManagedSocialProviderGoogleModule {
  static forRoot(config: IAuthManagedSocialProviderGoogleConfig): DynamicModule {
    return {
      module: AuthManagedSocialProviderGoogleModule,
      providers: [
        plainToValidatedInstanceProvider(AuthManagedSocialProviderGoogleConfig, config),
        AuthManagedSocialProviderGoogleService,
      ],
      exports: [AuthManagedSocialProviderGoogleService],
    };
  }
}
