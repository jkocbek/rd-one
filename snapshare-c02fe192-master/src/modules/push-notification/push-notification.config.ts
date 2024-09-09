import { Expose, Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config/index';

import { TransformInputToBoolean } from '~vendors/class-validator';

@ConfigDecorator('fcm')
export class PushNotificationConfig {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @TransformInputToBoolean()
  readonly setupRequired: boolean = false;

  @Expose()
  @IsOptional()
  @IsString()
  @Transform(({ value }) => (typeof value === 'string' ? value.replace(/\\n/g, '\n') : value))
  readonly privateKey?: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly clientEmail?: string;

  @Expose()
  @IsOptional()
  @IsString()
  readonly projectId?: string;
}
