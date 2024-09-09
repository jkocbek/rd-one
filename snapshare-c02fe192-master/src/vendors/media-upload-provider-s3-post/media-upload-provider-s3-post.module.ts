import { DynamicModule, Module } from '@nestjs/common';

import { plainToValidatedInstanceProvider } from '~vendors/class-validator';

import {
  IMediaUploadProviderS3PostConfig,
  MediaUploadProviderS3PostConfig,
} from './media-upload-provider-s3-post.config';
import { MediaUploadProviderS3PostService } from './media-upload-provider-s3-post.service';

@Module({})
export class MediaUploadProviderS3PostModule {
  static forRoot(config: IMediaUploadProviderS3PostConfig): DynamicModule {
    return {
      module: MediaUploadProviderS3PostModule,
      providers: [
        plainToValidatedInstanceProvider(MediaUploadProviderS3PostConfig, config),
        MediaUploadProviderS3PostService,
      ],
      exports: [MediaUploadProviderS3PostService],
    };
  }
}
