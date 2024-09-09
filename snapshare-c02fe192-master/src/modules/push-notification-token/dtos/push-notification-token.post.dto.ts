import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PushNotificationTokenPostDto {
  @ApiProperty({ description: 'Token' })
  @IsString()
  @IsNotEmpty()
  readonly token!: string;
}
