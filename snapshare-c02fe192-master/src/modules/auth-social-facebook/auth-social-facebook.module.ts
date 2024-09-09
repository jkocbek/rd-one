import { Logger, Module } from '@nestjs/common';

import { getConfig } from '~common/config';

import { AuthManagedSocialProviderFacebookModule } from '~vendors/auth-managed-social-provider-facebook/auth-managed-social-provider-facebook.module';

import { AuthSocialFacebookConfig } from '~modules/auth-social-facebook/auth-social-facebook.config';
import { AuthModule } from '~modules/auth/auth.module';
import { UserIdentityProviderModule } from '~modules/user-identity-provider/user-identity-provider.module';
import { UserModule } from '~modules/user/user.module';

import { AuthSocialFacebookController } from './auth-social-facebook.controller';
import { AuthSocialFacebookService } from './auth-social-facebook.service';

const authFacebookConfig = getConfig(AuthSocialFacebookConfig);

@Module({
  imports: [
    AuthManagedSocialProviderFacebookModule.forRoot({
      version: authFacebookConfig.version,
      appId: authFacebookConfig.appId,
      appSecret: authFacebookConfig.appSecret,
      responseType: authFacebookConfig.responseType,
      scopes: authFacebookConfig.scopes,
      userInfoFields: authFacebookConfig.userInfoFields,
    }),
    UserModule,
    UserIdentityProviderModule,
    AuthModule,
  ],
  controllers: [AuthSocialFacebookController],
  providers: [
    {
      provide: AuthSocialFacebookService.LOGGER_KEY,
      useValue: new Logger(AuthSocialFacebookService.name),
    },
    AuthSocialFacebookService,
  ],
  exports: [AuthSocialFacebookService],
})
export class AuthSocialFacebookModule {}
