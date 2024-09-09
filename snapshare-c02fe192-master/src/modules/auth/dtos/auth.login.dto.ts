import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class AuthLoginDto {
  @Expose()
  @ApiProperty({ description: 'Email' })
  @IsEmail()
  readonly email!: string;

  @Expose()
  @ApiProperty({ description: 'Password' })
  @IsString()
  @IsNotEmpty()
  readonly password!: string;
}
