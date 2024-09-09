import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { IAuthSocialGoogleCredentials } from '../interfaces/auth-social-google.credentials.interface';

export class AuthSocialGoogleCredentialsDto {
  @Expose()
  @ApiProperty({ description: 'Base Url' })
  @IsString()
  @IsNotEmpty()
  readonly baseUrl!: string;

  @Expose()
  @ApiProperty({ description: 'Client Id' })
  @IsString()
  @IsNotEmpty()
  readonly clientId!: string;

  @Expose()
  @ApiProperty({ description: 'Scopes' })
  @IsArray()
  @IsString({ each: true })
  readonly scopes!: string[];

  @Expose()
  @ApiProperty({ description: 'Response Type' })
  @IsString()
  @IsNotEmpty()
  readonly responseType!: string;

  static create(data: IAuthSocialGoogleCredentials): AuthSocialGoogleCredentialsDto {
    return plainToValidatedInstance(AuthSocialGoogleCredentialsDto, data);
  }
}
