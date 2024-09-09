import { Expose } from 'class-transformer';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { TransformInputToBoolean } from '~vendors/class-validator';

export class AuthExternalProviderAwsCognitoClientConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly region!: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly clientId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly userPoolId?: string;

  @Expose()
  @IsBoolean()
  @TransformInputToBoolean()
  readonly allowSigninAdminUser: boolean = false;
}

export interface IAuthExternalProviderAwsCognitoClientConfig extends AuthExternalProviderAwsCognitoClientConfig {}
