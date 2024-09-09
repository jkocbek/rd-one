import { Inject, Injectable, Logger } from '@nestjs/common';

import {
  BadRequestException,
  ForbiddenException,
  InternalServerErrorException,
  NotFoundException,
} from '~common/exceptions';

import { MediaPresignedUrlService } from '~modules/media-presigned-url/media-presigned-url.service';
import { MediaStatus } from '~modules/media/enums/media.status.enum';
import { MediaUse } from '~modules/media/enums/media.use.enum';
import { IMedia } from '~modules/media/interfaces/media.interface';
import { mediaUseConstraints } from '~modules/media/media.constants';
import { MediaService } from '~modules/media/media.service';

import { MediaValidationHelper } from './media-validation.helper';

@Injectable()
export class MediaValidationService {
  static readonly LOGGER_KEY = 'media-validation-service-logger';

  constructor(
    @Inject(MediaValidationService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly mediaService: MediaService,
    private readonly mediaPresignedUrlService: MediaPresignedUrlService,
  ) {}

  async validateById(id: string, userId?: string): Promise<void> {
    const media = await this.mediaService.findById(id);
    if (!media) {
      this.logger.warn(`Could not find media by id ${id}.`);
      throw new NotFoundException(`Media not found by id for validation.`, 'MEDIA_VALIDATION_NOT_FOUND_BY_ID');
    }

    if (userId && userId !== media.userId) {
      throw new ForbiddenException(
        `User cannot access media obtained by id.`,
        'MEDIA_VALIDATION_FORBIDDEN_ACCESS_BY_ID',
      );
    }

    await this.validateInternal(media);
  }

  async validateByObjectKey(objectKey: string, userId?: string): Promise<void> {
    const media = await this.mediaService.findByObjectKey(objectKey);
    if (!media) {
      this.logger.warn(`Could not find media by object key ${objectKey}.`);
      throw new NotFoundException(
        `Media not found by object key for validation.`,
        'MEDIA_VALIDATION_NOT_FOUND_BY_OBJECT_KEY',
      );
    }

    if (userId && userId !== media.userId) {
      throw new ForbiddenException(
        `User cannot access media obtained by object key.`,
        'MEDIA_VALIDATION_FORBIDDEN_ACCESS_BY_OBJECT_KEY',
      );
    }

    await this.validateInternal(media);
  }

  async validateByUrl(url: string, userId?: string): Promise<void> {
    const media = await this.mediaService.findByUrl(url);
    if (!media) {
      this.logger.warn(`Could not find media by url ${url}.`);
      throw new NotFoundException(`Media not found by url for validation.`, 'MEDIA_VALIDATION_NOT_FOUND_BY_URL');
    }

    if (userId && userId !== media.userId) {
      throw new ForbiddenException(
        `User cannot access media obtained by url.`,
        'MEDIA_VALIDATION_FORBIDDEN_ACCESS_BY_URL',
      );
    }

    await this.validateInternal(media);
  }

  private async validateInternal(media: IMedia): Promise<void> {
    if (media.status === MediaStatus.CREATED) {
      media = await this.updateStatusInternal(media.objectKey, media.use);
    }

    await this.checkStatusInternal(media);
  }

  private async updateStatusInternal(objectKey: string, use: MediaUse): Promise<IMedia> {
    const uploadedMimeType = await this.mediaPresignedUrlService.getMediaMimeType(objectKey);
    if (!uploadedMimeType) {
      const noMimeTypeMedia = await this.mediaService.updateByObjectKey(objectKey, {
        status: MediaStatus.FAILED,
      });
      this.logger.warn(`Could not obtain content mime type of media by object key ${objectKey}.`);

      return noMimeTypeMedia;
    }

    const mediaConstraints = mediaUseConstraints[use];
    const isMimeTypeAllowed = MediaValidationHelper.validateMimeType(
      uploadedMimeType,
      mediaConstraints.allowedMimeTypes,
    );

    if (!isMimeTypeAllowed) {
      const notAllowedMimeTypeMedia = await this.mediaService.updateByObjectKey(objectKey, {
        status: MediaStatus.FAILED,
        mimeType: uploadedMimeType,
      });
      this.logger.warn(
        `Media object with object key ${objectKey} has content mime type ${uploadedMimeType} which is not allowed for media use ${use}.`,
      );

      return notAllowedMimeTypeMedia;
    }

    const verifiedMedia = await this.mediaService.updateByObjectKey(objectKey, {
      status: MediaStatus.VERIFIED,
      mimeType: uploadedMimeType,
    });

    return verifiedMedia;
  }

  private async checkStatusInternal(media: IMedia): Promise<void> {
    switch (media.status) {
      case MediaStatus.VERIFIED: {
        return;
      }

      case MediaStatus.FAILED: {
        this.logger.warn(`Media ${media.id} is in failed status.`);
        throw new BadRequestException(`Failed media.`, 'MEDIA_VALIDATION_FAILED_MEDIA');
      }

      case MediaStatus.CREATED: {
        this.logger.error(
          `Media ${media.id} status is ${MediaStatus.CREATED} which cannot exist in this part of code.`,
        );
        throw new InternalServerErrorException(
          `Media cannot have status ${MediaStatus.CREATED} at this part of the code.`,
          'MEDIA_VALIDATION_INVALID_STATUS',
        );
      }
    }
  }
}
