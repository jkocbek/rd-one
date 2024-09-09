import { INestApplication } from '@nestjs/common';
import { Media } from '@prisma/client';

import { getConfig } from '~common/config';

import { PrismaService } from '~vendors/prisma/prisma.service';

import { MediaPresignedUrlConfig } from '~modules/media-presigned-url/media-presigned-url.config';
import { MediaStatus } from '~modules/media/enums/media.status.enum';
import { MediaUse } from '~modules/media/enums/media.use.enum';
import { makeUUID } from '~utils/uuid';

const mediaPresignedUrlConfig = getConfig(MediaPresignedUrlConfig);

export class MediaFixture {
  static async createPendingMedia(app: INestApplication, use: MediaUse, userId: string): Promise<Media> {
    const prisma = app.get<PrismaService>(PrismaService);

    const partialMediaProperties = MediaFixture.generateMediaCreateInput(use);

    const media = await prisma.media.create({
      data: { ...partialMediaProperties, userId, status: MediaStatus.CREATED },
    });

    return media;
  }

  static async createVerifiedMedia(app: INestApplication, use: MediaUse, userId: string): Promise<Media> {
    const prisma = app.get<PrismaService>(PrismaService);

    const partialMediaProperties = MediaFixture.generateMediaCreateInput(use);

    const media = await prisma.media.create({
      data: { ...partialMediaProperties, userId, status: MediaStatus.VERIFIED },
    });

    return media;
  }

  static async createFailedMedia(app: INestApplication, use: MediaUse, userId: string): Promise<Media> {
    const prisma = app.get<PrismaService>(PrismaService);

    const partialMediaProperties = MediaFixture.generateMediaCreateInput(use);

    const media = await prisma.media.create({
      data: { ...partialMediaProperties, userId, status: MediaStatus.FAILED },
    });

    return media;
  }

  private static generateMediaCreateInput(use: MediaUse): { objectKey: string; url: string; use: MediaUse } {
    const id = makeUUID();
    const uploadsFolder = mediaPresignedUrlConfig.uploadFolder;
    const objectKey = `${uploadsFolder}/${use}/${id}`;
    const url = `https://example.com/${objectKey}`;

    return {
      objectKey,
      url,
      use,
    };
  }
}
