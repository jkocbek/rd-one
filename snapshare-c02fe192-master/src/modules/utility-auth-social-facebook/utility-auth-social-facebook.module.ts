import { DynamicModule, Module } from '@nestjs/common';

import { getConfig, getConfigFactory } from '~common/config';

import { AuthSocialFacebookModule } from '~modules/auth-social-facebook/auth-social-facebook.module';

import { UtilityAuthSocialFacebookConfig } from './utility-auth-social-facebook.config';
import { UtilityAuthSocialFacebookController } from './utility-auth-social-facebook.controller';
import { UtilityAuthSocialFacebookService } from './utility-auth-social-facebook.service';

const utilityAuthSocialFacebookConfig = getConfig(UtilityAuthSocialFacebookConfig);

@Module({})
export class UtilityAuthSocialFacebookModule {
  static forRoot(): DynamicModule {
    if (utilityAuthSocialFacebookConfig && utilityAuthSocialFacebookConfig.enabled) {
      return {
        module: UtilityAuthSocialFacebookModule,
        imports: [AuthSocialFacebookModule],
        controllers: [UtilityAuthSocialFacebookController],
        providers: [getConfigFactory(UtilityAuthSocialFacebookConfig), UtilityAuthSocialFacebookService],
        exports: [UtilityAuthSocialFacebookService],
      };
    }

    return {
      module: UtilityAuthSocialFacebookModule,
    };
  }
}
