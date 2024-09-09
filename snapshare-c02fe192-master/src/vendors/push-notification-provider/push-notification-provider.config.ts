import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export abstract class PushNotificationProviderConfig {
  @Expose()
  @IsBoolean()
  readonly setupRequired!: boolean;
}
