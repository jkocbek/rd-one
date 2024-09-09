import { DynamicModule, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import { IMediaUploadProviderS3PutConfig, MediaUploadProviderS3PutConfig } from './media-upload-provider-s3-put.config';
import { MediaUploadProviderS3PutService } from './media-upload-provider-s3-put.service';

@Module({})
export class MediaUploadProviderS3PutModule {
  static forRoot(config: IMediaUploadProviderS3PutConfig): DynamicModule {
    return {
      module: MediaUploadProviderS3PutModule,
      providers: [
        plainToValidatedInstanceProvider(MediaUploadProviderS3PutConfig, config),
        MediaUploadProviderS3PutService,
      ],
      exports: [MediaUploadProviderS3PutService],
    };
  }
}
