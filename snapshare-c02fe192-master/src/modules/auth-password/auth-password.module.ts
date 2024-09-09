import { DynamicModule, Logger, Module } from '@nestjs/common';

import { getConfig, getConfigFactory } from '~common/config';

import { AppConfig } from '~modules/app/app.config';
import { AuthModule } from '~modules/auth/auth.module';
import { PasswordForgotModule } from '~modules/password-forgot/password-forgot.module';
import { RefreshTokenModule } from '~modules/refresh-token/refresh-token.module';
import { UserSessionModule } from '~modules/user-session/user-session.module';
import { UserModule } from '~modules/user/user.module';

import { AuthPasswordConfig } from './auth-password.config';
import { AuthPasswordController } from './auth-password.controller';
import { AuthPasswordService } from './auth-password.service';

const authPasswordConfig = getConfig(AuthPasswordConfig);

@Module({})
export class AuthPasswordModule {
  static forRootOptionalAsync(): DynamicModule {
    if (authPasswordConfig?.enabled) {
      return {
        module: AuthPasswordModule,
        imports: [UserModule, PasswordForgotModule, AuthModule, UserSessionModule, RefreshTokenModule],
        controllers: [AuthPasswordController],
        providers: [
          getConfigFactory(AppConfig),
          getConfigFactory(AuthPasswordConfig),
          {
            provide: AuthPasswordService.LOGGER_KEY,
            useValue: new Logger(AuthPasswordService.name),
          },
          AuthPasswordService,
        ],
        exports: [AuthPasswordService],
      };
    }

    return {
      module: AuthPasswordModule,
    };
  }
}
