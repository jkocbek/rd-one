import { Expose } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config';

import { TransformInputToBoolean } from '~vendors/class-validator';

@ConfigDecorator('utilityAuthSocialGoogle')
export class UtilityAuthSocialGoogleConfig {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @TransformInputToBoolean()
  enabled: boolean = false;

  @Expose()
  @IsString()
  readonly frontendUrl!: string;
}
