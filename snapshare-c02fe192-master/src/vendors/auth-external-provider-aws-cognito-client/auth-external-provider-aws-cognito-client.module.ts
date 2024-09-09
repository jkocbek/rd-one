import { DynamicModule, Logger, Module } from '@nestjs/common';

import { AwsCognitoClientIdentityProviderModule } from '~vendors/aws-sdk-cognito-client-identity-provider/aws-sdk-cognito-client-identity-provider.module';
import { plainToValidatedInstanceProvider } from '~vendors/class-validator';
import { OpenidClientAwsCognitoModule } from '~vendors/openid-client-aws-cognito/openid-client-aws-cognito.module';
import { OpenidClientAwsCognitoService } from '~vendors/openid-client-aws-cognito/openid-client-aws-cognito.service';
import { OpenidClientService } from '~vendors/openid-client/openid-client.service';

import {
  AuthExternalProviderAwsCognitoClientConfig,
  IAuthExternalProviderAwsCognitoClientConfig,
} from './auth-external-provider-aws-cognito-client.config';
import { AuthExternalProviderAwsCognitoClientService } from './auth-external-provider-aws-cognito-client.service';

@Module({})
export class AuthExternalProviderAwsCognitoClientModule {
  static forRoot(config: IAuthExternalProviderAwsCognitoClientConfig): DynamicModule {
    return {
      module: AuthExternalProviderAwsCognitoClientModule,
      imports: [
        OpenidClientAwsCognitoModule.forRoot({
          region: config.region,
          clientId: config.clientId,
          userPoolId: config.userPoolId,
        }),
        AwsCognitoClientIdentityProviderModule.forRoot({
          region: config.region,
        }),
      ],
      providers: [
        plainToValidatedInstanceProvider(AuthExternalProviderAwsCognitoClientConfig, config),
        {
          provide: AuthExternalProviderAwsCognitoClientService.LOGGER_KEY,
          useValue: new Logger(AuthExternalProviderAwsCognitoClientService.name),
        },
        {
          provide: OpenidClientService,
          useExisting: OpenidClientAwsCognitoService,
        },
        AuthExternalProviderAwsCognitoClientService,
      ],
      exports: [AuthExternalProviderAwsCognitoClientService],
    };
  }
}
