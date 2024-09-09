import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { IAuthResponse } from '../interfaces/auth.response.interface';

export class AuthResponseDto {
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

  static create(data: IAuthResponse): AuthResponseDto {
    return plainToValidatedInstance(AuthResponseDto, data);
  }
}
