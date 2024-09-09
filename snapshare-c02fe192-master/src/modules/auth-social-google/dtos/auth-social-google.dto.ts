import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { IAuthSocialGoogle } from '../interfaces/auth-social-google.interface';

export class AuthSocialGoogleDto {
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

  static create(data: IAuthSocialGoogle): AuthSocialGoogleDto {
    return plainToValidatedInstance(AuthSocialGoogleDto, data);
  }
}
