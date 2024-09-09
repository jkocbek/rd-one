import { Logger, Module } from '@nestjs/common';

import { getConfig, getConfigFactory } from '~common/config';

import { MediaUploadProviderS3PutModule } from '~vendors/media-upload-provider-s3-put/media-upload-provider-s3-put.module';

import { MediaModule } from '~modules/media/media.module';

import { MediaPresignedUrlConfig } from './media-presigned-url.config';
import { MediaPresignedUrlController } from './media-presigned-url.controller';
import { MediaPresignedUrlService } from './media-presigned-url.service';

const mediaPresignedUrlConfig = getConfig(MediaPresignedUrlConfig);

@Module({
  imports: [
    MediaModule,
    MediaUploadProviderS3PutModule.forRoot({
      bucket: mediaPresignedUrlConfig.bucket,
      region: mediaPresignedUrlConfig.region,
      accessKeyId: mediaPresignedUrlConfig.accessKeyId,
      secretAccessKey: mediaPresignedUrlConfig.secretAccessKey,
      apiEndpoint: mediaPresignedUrlConfig.apiEndpoint,
    }),
  ],
  controllers: [MediaPresignedUrlController],
  providers: [
    getConfigFactory(MediaPresignedUrlConfig),
    {
      provide: MediaPresignedUrlService.LOGGER_KEY,
      useValue: new Logger(MediaPresignedUrlService.name),
    },
    MediaPresignedUrlService,
  ],
  exports: [MediaPresignedUrlService],
})
export class MediaPresignedUrlModule {}
