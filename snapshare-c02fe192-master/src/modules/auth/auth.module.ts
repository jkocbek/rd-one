import { Logger, Module } from '@nestjs/common';

import { getConfig, getConfigFactory } from '~common/config';

import { AuthManagedCustomProviderEmailPasswordModule } from '~vendors/auth-managed-custom-provider-email-password/auth-managed-custom-provider-email-password.module';

import { RefreshTokenModule } from '~modules/refresh-token/refresh-token.module';
import { UserIdentityProviderModule } from '~modules/user-identity-provider/user-identity-provider.module';
import { UserInvitationModule } from '~modules/user-invitation/user-invitation.module';
import { UserSessionModule } from '~modules/user-session/user-session.module';
import { UserModule } from '~modules/user/user.module';

import { AuthConfig } from './auth.config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

const authConfig = getConfig(AuthConfig);

@Module({
  imports: [
    AuthManagedCustomProviderEmailPasswordModule.forRoot({
      saltRounds: authConfig.saltRounds,
      accessTokenSecret: authConfig.accessTokenSecret,
      accessTokenExpiration: authConfig.accessTokenExpiration,
      refreshTokenSecret: authConfig.refreshTokenSecret,
      refreshTokenExpiration: authConfig.refreshTokenExpiration,
    }),
    UserModule,
    UserIdentityProviderModule,
    UserInvitationModule,
    UserSessionModule,
    RefreshTokenModule,
  ],
  controllers: [AuthController],
  providers: [
    getConfigFactory(AuthConfig),
    {
      provide: AuthService.LOGGER_KEY,
      useValue: new Logger(AuthService.name),
    },
    AuthService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
