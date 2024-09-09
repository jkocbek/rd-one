import { CognitoIdentityProvider } from '@aws-sdk/client-cognito-identity-provider';
import { Inject, Injectable, Logger } from '@nestjs/common';

import { AwsCognitoClientIdentityProviderConfig } from './aws-sdk-cognito-client-identity-provider.config';
import { IAwsSdkCognitoClientIdentityProviderUser } from './interfaces/aws-sdk-cognito-client-identity-provider.user.interface';

@Injectable()
export class AwsCognitoClientIdentityProviderService {
  static readonly LOGGER_KEY = 'aws-cognito-client-identity-provider-service-logger';

  constructor(
    readonly awsCognitoClientIdentityProviderConfig: AwsCognitoClientIdentityProviderConfig,
    @Inject(AwsCognitoClientIdentityProviderService.LOGGER_KEY)
    protected readonly logger: Logger,
  ) {
    this._client = new CognitoIdentityProvider({ region: awsCognitoClientIdentityProviderConfig.region });
  }

  private _client: CognitoIdentityProvider;

  async getUser(accessToken: string): Promise<IAwsSdkCognitoClientIdentityProviderUser> {
    const cognitoUser = await this._client.getUser({ AccessToken: accessToken });

    const username = cognitoUser.Username;
    const cognitoUserAttributes = cognitoUser.UserAttributes;
    const attributes = new Map<string, string | undefined>();

    if (cognitoUserAttributes) {
      cognitoUserAttributes.map((attribute) => {
        if (attribute.Name) {
          attributes.set(attribute.Name, attribute.Value);
        }
      });
    }

    return {
      username,
      attributes,
    };
  }
}
