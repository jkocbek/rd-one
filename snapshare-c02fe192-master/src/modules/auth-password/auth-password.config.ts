import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';

import { ConfigDecorator } from '~common/config';

@ConfigDecorator('authPassword')
export class AuthPasswordConfig {
  @Expose()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  enabled: boolean = true;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  codeLength: number = 32;

  @Expose()
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  codeExpiration: number = 3600;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  invalidateSessionsOnReset: boolean = true;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  requireNewPasswordOnReset: boolean = false;
}
