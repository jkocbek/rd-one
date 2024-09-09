import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MediaUploadProviderS3PutConfig {
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

export interface IMediaUploadProviderS3PutConfig extends MediaUploadProviderS3PutConfig {}
