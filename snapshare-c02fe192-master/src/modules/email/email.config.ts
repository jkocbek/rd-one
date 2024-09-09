import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config/index';

@ConfigDecorator('email')
export class EmailConfig {
  @Expose()
  @IsOptional()
  @IsString()
  accessKeyId?: string;

  @Expose()
  @IsOptional()
  @IsString()
  secretAccessKey?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  region!: string;

  @Expose()
  @IsOptional()
  @IsString()
  apiEndpoint?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  emailFrom!: string;
}
