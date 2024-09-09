import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthRefreshTokenDto {
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
}
