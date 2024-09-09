import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { IPushNotificationToken } from '../interfaces/push-notification-token.interface';

export class PushNotificationTokenDto {
  @Expose()
  @ApiProperty({ description: 'Created At' })
  @IsDate()
  @Type(() => Date)
  readonly createdAt!: Date;

  @Expose()
  @ApiProperty({ description: 'Updated At' })
  @IsDate()
  @Type(() => Date)
  readonly updatedAt!: Date;

  @Expose()
  @ApiProperty({ description: 'Token' })
  @IsString()
  @IsNotEmpty()
  readonly token!: string;

  static create(data: IPushNotificationToken): PushNotificationTokenDto {
    return plainToValidatedInstance(PushNotificationTokenDto, data);
  }
}
