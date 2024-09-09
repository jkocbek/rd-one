import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config';

@ConfigDecorator('mediaPresignedUrl')
export class MediaPresignedUrlConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  uploadFolder!: string;

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
  region!: string;

  @Expose()
  @IsString()
  bucket!: string;

  @Expose()
  @IsOptional()
  @IsString()
  apiEndpoint?: string;
}
