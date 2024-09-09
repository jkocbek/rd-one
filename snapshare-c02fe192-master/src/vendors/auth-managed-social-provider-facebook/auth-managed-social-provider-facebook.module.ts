import { DynamicModule, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import {
  AuthManagedSocialProviderFacebookConfig,
  IAuthManagedSocialProviderFacebookConfig,
} from './auth-managed-social-provider-facebook.config';
import { AuthManagedSocialProviderFacebookService } from './auth-managed-social-provider-facebook.service';

@Module({})
export class AuthManagedSocialProviderFacebookModule {
  static forRoot(config: IAuthManagedSocialProviderFacebookConfig): DynamicModule {
    return {
      module: AuthManagedSocialProviderFacebookModule,
      providers: [
        plainToValidatedInstanceProvider(AuthManagedSocialProviderFacebookConfig, config),
        AuthManagedSocialProviderFacebookService,
      ],
      exports: [AuthManagedSocialProviderFacebookService],
    };
  }
}
