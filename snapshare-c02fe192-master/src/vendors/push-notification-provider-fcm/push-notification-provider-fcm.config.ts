import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

import { PushNotificationProviderConfig } from '~vendors/push-notification-provider/push-notification-provider.config';

export class PushNotificationProviderFcmConfig extends PushNotificationProviderConfig {
  @Expose()
  @IsString()
  @IsOptional()
  readonly privateKey?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly clientEmail?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly projectId?: string;
}

export interface IPushNotificationProviderFcmConfig extends PushNotificationProviderFcmConfig {}
