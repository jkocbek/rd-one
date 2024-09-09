import { Expose, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested, isString } from 'class-validator';

import { ConfigDecorator } from '~common/config';

import { TransformInputToBoolean } from '~vendors/class-validator';
import { TransformInputToArray } from '~vendors/class-validator';

class HttpCorsConfig {
  @Expose()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @TransformInputToArray(isString)
  url?: string[];

  @Expose()
  @IsBoolean()
  @TransformInputToBoolean()
  all!: boolean;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  maxAge: number = 3600;
}

@ConfigDecorator('http')
export class HttpConfig {
  @Expose()
  @IsNumber()
  @Type(() => Number)
  port = 3000;

  @Expose()
  @IsString()
  hostname: string = '0.0.0.0';

  @Expose()
  @IsString()
  prefix: string = '';

  @Expose()
  @Type(() => HttpCorsConfig)
  @ValidateNested()
  cors!: HttpCorsConfig;

  @Expose()
  @IsOptional()
  @IsBoolean()
  @TransformInputToBoolean()
  log?: boolean;
}
