import { DynamicModule, Module } from '@nestjs/common';

import { getConfig, getConfigFactory } from '~common/config';

import { AuthSocialGoogleModule } from '~modules/auth-social-google/auth-social-google.module';

import { UtilityAuthSocialGoogleConfig } from './utility-auth-social-google.config';
import { UtilityAuthSocialGoogleController } from './utility-auth-social-google.controller';
import { UtilityAuthSocialGoogleService } from './utility-auth-social-google.service';

const utilityAuthSocialGoogleConfig = getConfig(UtilityAuthSocialGoogleConfig);

@Module({})
export class UtilityAuthSocialGoogleModule {
  static forRoot(): DynamicModule {
    if (utilityAuthSocialGoogleConfig && utilityAuthSocialGoogleConfig.enabled) {
      return {
        module: UtilityAuthSocialGoogleModule,
        imports: [AuthSocialGoogleModule],
        controllers: [UtilityAuthSocialGoogleController],
        providers: [getConfigFactory(UtilityAuthSocialGoogleConfig), UtilityAuthSocialGoogleService],
        exports: [UtilityAuthSocialGoogleService],
      };
    }

    return {
      module: UtilityAuthSocialGoogleModule,
    };
  }
}
