import { Logger, NotImplementedException, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { verify } from 'jsonwebtoken';
import { JwksClient } from 'jwks-rsa';
import { BaseClient, Issuer } from 'openid-client';

import { OpenidClientUserinfo } from './interfaces/openid-client.user-info.interface';

export abstract class OpenidClientService implements OnModuleInit {
  constructor(
    protected readonly logger: Logger,
    readonly responseTypes: string[],
    readonly issuer?: string,
    readonly clientId?: string,
    readonly jwksEndpoint?: string,
  ) {
    this._issuer = issuer;
    this._clientId = clientId;
    this._responseTypes = responseTypes;

    if (jwksEndpoint) {
      this._jwksClient = new JwksClient({
        jwksUri: jwksEndpoint,
      });
    }
  }

  private readonly _issuer?: string;
  private readonly _clientId?: string;
  private readonly _jwksClient?: JwksClient;
  private readonly _responseTypes: string[];
  private _openidClient?: BaseClient;

  get isSetup(): boolean {
    return this._issuer && this._clientId && this._jwksClient ? true : false;
  }

  get client(): BaseClient {
    if (!this._openidClient) {
      this.logger.error('openid client is not setup. Cannot get client.');
      throw new NotImplementedException('Authentication client is not setup.');
    }

    return this._openidClient;
  }

  abstract getUserInfo(accessToken: string): Promise<OpenidClientUserinfo>;

  async onModuleInit() {
    if (!this.isSetup) {
      this.logger.warn(`openid client is not setup. Skipping authentication setup...`);
      return;
    }

    const issuer = await Issuer.discover(this._issuer as string);
    this._openidClient = new issuer.Client({
      client_id: this._clientId as string,
      response_types: this._responseTypes,
    });
  }

  async verify(token: string): Promise<void> {
    if (!this.isSetup) {
      this.logger.error('Authentication is not setup. Cannot verify.');
      throw new NotImplementedException('Authentication verification method is not setup.');
    }

    const client = this._jwksClient as JwksClient;

    try {
      await new Promise<void>((resolve, reject) => {
        verify(
          token,
          async (header, callback) => {
            try {
              const key = await client.getSigningKey(header.kid);
              const signingKey = key.getPublicKey();
              callback(null, signingKey);
            } catch (err) {
              this.logger.error('Error occurred getting signing key. Error: ', err);
              reject(err);
            }
          },
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          (err, _decoded) => {
            if (err) {
              reject(err);
            }
            resolve();
          },
        );
      });
    } catch (err) {
      this.logger.error('Error occured verifying token. Error: ', err);
      throw new UnauthorizedException();
    }
  }
}
