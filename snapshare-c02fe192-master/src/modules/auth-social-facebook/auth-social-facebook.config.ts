import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, isString } from 'class-validator';

import { ConfigDecorator } from '~common/config';

import { TransformInputToArray } from '~vendors/class-validator';

@ConfigDecorator('authSocialFacebook')
export class AuthSocialFacebookConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly version!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly appId!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly appSecret!: string;

  @Expose()
  @TransformInputToArray(isString, { defaultToEmpty: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly scopes: string[] = [];

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly responseType!: string;

  @Expose()
  @TransformInputToArray(isString, { defaultToEmpty: true })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  readonly userInfoFields: string[] = [];
}
