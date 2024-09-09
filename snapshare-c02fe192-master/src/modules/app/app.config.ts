import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config';

import { TransformInputToBoolean } from '~vendors/class-validator';

@ConfigDecorator('app')
export class AppConfig {
  @Expose()
  @IsString()
  readonly stage!: string;

  @Expose()
  @IsString()
  readonly version!: string;

  @Expose()
  @IsString()
  readonly release!: string;

  @Expose()
  @IsString()
  readonly buildTime!: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @TransformInputToBoolean()
  readonly runQueueWorkers?: boolean;

  @Expose()
  @IsString()
  readonly frontendUrl!: string;

  @Expose()
  @IsString()
  readonly apiBaseUrl!: string;
}
