import { Logger, Module } from '@nestjs/common';

import { getConfig } from '~common/config';

import { AuthManagedSocialProviderGoogleModule } from '~vendors/auth-managed-social-provider-google/auth-managed-social-provider-google.module';

import { AuthModule } from '~modules/auth/auth.module';
import { UserIdentityProviderModule } from '~modules/user-identity-provider/user-identity-provider.module';
import { UserModule } from '~modules/user/user.module';

import { AuthSocialGoogleConfig } from './auth-social-google.config';
import { AuthSocialGoogleController } from './auth-social-google.controller';
import { AuthSocialGoogleService } from './auth-social-google.service';

const authSocialGoogleConfig = getConfig(AuthSocialGoogleConfig);

@Module({
  imports: [
    AuthManagedSocialProviderGoogleModule.forRoot({
      clientId: authSocialGoogleConfig.clientId,
      clientSecret: authSocialGoogleConfig.clientSecret,
      scopes: authSocialGoogleConfig.scopes,
      responseType: authSocialGoogleConfig.responseType,
    }),
    UserModule,
    UserIdentityProviderModule,
    AuthModule,
  ],
  controllers: [AuthSocialGoogleController],
  providers: [
    {
      provide: AuthSocialGoogleService.LOGGER_KEY,
      useValue: new Logger(AuthSocialGoogleService.name),
    },
    AuthSocialGoogleService,
  ],
  exports: [AuthSocialGoogleService],
})
export class AuthSocialGoogleModule {}
