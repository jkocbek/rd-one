import { Media } from '@prisma/client';

import { MediaStatus } from './enums/media.status.enum';
import { MediaUse } from './enums/media.use.enum';
import { IMedia } from './interfaces/media.interface';

export class MediaHelper {
  static fromMedia(media: Media): IMedia {
    return {
      id: media.id,
      url: media.url,
      mimeType: media.mimeType ?? undefined,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
      objectKey: media.objectKey,
      status: MediaHelper.parseMediaStatus(media.status),
      use: MediaHelper.parseMediaUse(media.use),
      userId: media.userId,
    };
  }

  static parseMediaStatus(stringifiedValue: string): MediaStatus {
    const status = MediaStatus[stringifiedValue as keyof typeof MediaStatus];
    return status;
  }

  static parseMediaUse(stringifiedValue: string): MediaUse {
    const use = MediaUse[stringifiedValue as keyof typeof MediaUse];
    return use;
  }
}
