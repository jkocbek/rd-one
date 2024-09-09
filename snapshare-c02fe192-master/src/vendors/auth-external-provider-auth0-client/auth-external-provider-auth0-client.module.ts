import { DynamicModule, Logger, Module } from '@nestjs/common';

import { OpenidClientAuth0Module } from '~vendors/openid-client-auth0/openid-client-auth0.module';

import { IAuthExternalProviderAuth0ClientConfig } from './auth-external-provider-auth0-client.config';
import { AuthExternalProviderAuth0ClientService } from './auth-external-provider-auth0-client.service';

@Module({})
export class AuthExternalProviderAuth0ClientModule {
  static forRoot(config: IAuthExternalProviderAuth0ClientConfig): DynamicModule {
    return {
      module: AuthExternalProviderAuth0ClientModule,
      imports: [
        OpenidClientAuth0Module.forRoot({
          clientId: config.clientId,
          domain: config.domain,
        }),
      ],
      providers: [
        {
          provide: AuthExternalProviderAuth0ClientService.LOGGER_KEY,
          useValue: new Logger(AuthExternalProviderAuth0ClientService.name),
        },
        AuthExternalProviderAuth0ClientService,
      ],
      exports: [AuthExternalProviderAuth0ClientService],
    };
  }
}
