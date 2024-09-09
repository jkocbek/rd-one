import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class AuthPasswordResetDto {
  @Expose()
  @ApiProperty({ description: 'Code' })
  @IsString()
  @IsNotEmpty()
  readonly code!: string;

  @Expose()
  @ApiProperty({ description: 'New Password' })
  @IsString()
  @IsNotEmpty()
  readonly newPassword!: string;
}
