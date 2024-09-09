import { Inject, Injectable, Logger } from '@nestjs/common';

import { InternalServerErrorException } from '~common/exceptions';

import { MediaUploadProviderS3PutService } from '~vendors/media-upload-provider-s3-put/media-upload-provider-s3-put.service';

import { MediaStatus } from '~modules/media/enums/media.status.enum';
import { MediaUse } from '~modules/media/enums/media.use.enum';
import { mediaUseConstraints } from '~modules/media/media.constants';
import { MediaService } from '~modules/media/media.service';
import { makeUUID } from '~utils/uuid';

import { IMediaPresignedUrl } from './interfaces/media-presigned-url.interface';
import { MediaPresignedUrlConfig } from './media-presigned-url.config';
import { MediaPresignedUrlHelper } from './media-presigned-url.helper';

@Injectable()
export class MediaPresignedUrlService {
  static readonly LOGGER_KEY = 'media-presigned-url-service-logger';

  constructor(
    private readonly mediaPresignedUrlConfig: MediaPresignedUrlConfig,
    @Inject(MediaPresignedUrlService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly mediaService: MediaService,
    private readonly mediaUploadProviderS3PutService: MediaUploadProviderS3PutService,
  ) {}

  async createPresignedUrl(userId: string, use: MediaUse): Promise<IMediaPresignedUrl> {
    const mediaConstraints = mediaUseConstraints[use];

    const id = makeUUID();
    const key = `${this.mediaPresignedUrlConfig.uploadFolder}/${use}/${id}`;

    try {
      const response = await this.mediaUploadProviderS3PutService.generatePresignedUrlData(key, {
        minContentLength: mediaConstraints.minContentLength,
        maxContentLength: mediaConstraints.maxContentLength,
      });

      await this.mediaService.create({
        objectKey: key,
        url: response.mediaUrl,
        status: MediaStatus.CREATED,
        use,
        userId,
      });

      return MediaPresignedUrlHelper.fromIMediaUploadProviderPresignedUrlData(response);
    } catch (err) {
      this.logger.error(`Error occurred generating pre-signed url for user ${userId} for use ${use}. Error: `, err);
      throw new InternalServerErrorException(
        'Error generating media pre-signed url.',
        'MEDIA_PRESIGNED_URL_ERROR_GENERATING',
      );
    }
  }

  async getMediaMimeType(objectKey: string): Promise<string | undefined> {
    const result = await this.mediaUploadProviderS3PutService.getObjectMimeType(objectKey);
    return result;
  }
}
