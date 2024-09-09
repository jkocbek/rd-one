import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString, isString } from 'class-validator';

import { TransformInputToArray } from '~vendors/class-validator';

export class AuthManagedSocialProviderFacebookConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly version!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly responseType!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly appId!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly appSecret!: string;

  @Expose()
  @IsNotEmpty()
  @TransformInputToArray(isString)
  @IsArray()
  @IsString({ each: true })
  readonly scopes!: string[];

  @Expose()
  @IsNotEmpty()
  @TransformInputToArray(isString)
  @IsArray()
  @IsString({ each: true })
  readonly userInfoFields!: string[];
}

export interface IAuthManagedSocialProviderFacebookConfig extends AuthManagedSocialProviderFacebookConfig {}
