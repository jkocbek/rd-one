import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthSocialGoogleCallbackQuery {
  @Expose()
  @ApiProperty({ description: 'Code' })
  @IsString()
  @IsNotEmpty()
  readonly code!: string;

  @Expose()
  @ApiProperty({ description: 'Redirect Uri' })
  @IsString()
  @IsNotEmpty()
  readonly redirectUri!: string;
}
