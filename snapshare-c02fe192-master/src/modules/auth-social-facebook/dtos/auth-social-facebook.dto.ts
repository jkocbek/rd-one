import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { IAuthSocialFacebook } from '../interfaces/auth-social-facebook.interface';

export class AuthSocialFacebookDto {
  @Expose()
  @ApiProperty({ description: 'Access Token' })
  @IsString()
  @IsNotEmpty()
  readonly accessToken!: string;

  @Expose()
  @ApiProperty({ description: 'Refresh Token' })
  @IsString()
  @IsNotEmpty()
  readonly refreshToken!: string;

  static create(data: IAuthSocialFacebook): AuthSocialFacebookDto {
    return plainToValidatedInstance(AuthSocialFacebookDto, data);
  }
}
