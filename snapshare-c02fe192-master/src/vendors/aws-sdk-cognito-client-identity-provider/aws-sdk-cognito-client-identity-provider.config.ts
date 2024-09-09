import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';

export class AwsCognitoClientIdentityProviderConfig {
  @Expose()
  @IsString()
  readonly region!: string;
}

export interface IAwsCognitoClientIdentityProviderConfig extends AwsCognitoClientIdentityProviderConfig {}
