import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MediaUploadProviderS3PostConfig {
  @Expose()
  @IsString()
  @IsOptional()
  accessKeyId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  secretAccessKey?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  region!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  bucket!: string;

  @Expose()
  @IsString()
  @IsOptional()
  apiEndpoint?: string;
}

export interface IMediaUploadProviderS3PostConfig extends MediaUploadProviderS3PostConfig {}
