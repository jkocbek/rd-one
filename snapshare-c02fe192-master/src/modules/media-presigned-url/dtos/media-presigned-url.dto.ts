import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsObject, IsOptional, IsUrl } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { MediaPresignedUrlUploadMethod } from '../enums/media-presigned-url.upload-method.enum';
import { IMediaPresignedUrl } from '../interfaces/media-presigned-url.interface';

export class MediaPresignedUrlDto {
  @Expose()
  @ApiProperty({ description: 'Media Url' })
  @IsUrl()
  readonly mediaUrl!: string;

  @Expose()
  @ApiProperty({ description: 'Upload Method', enum: MediaPresignedUrlUploadMethod })
  @IsEnum(MediaPresignedUrlUploadMethod)
  readonly uploadMethod!: MediaPresignedUrlUploadMethod;

  @Expose()
  @ApiProperty({ description: 'Upload Url' })
  @IsUrl()
  readonly uploadUrl!: string;

  @Expose()
  @ApiPropertyOptional({ description: 'Fields', type: Object })
  @IsObject()
  @IsOptional()
  readonly fields?: Record<string, string>;

  static create(data: IMediaPresignedUrl): MediaPresignedUrlDto {
    return plainToValidatedInstance(MediaPresignedUrlDto, data);
  }
}
