import { Injectable } from '@nestjs/common';

import { PrismaService } from '~vendors/prisma/prisma.service';

import { IMediaCreate } from './interfaces/media.create.interface';
import { IMedia } from './interfaces/media.interface';
import { IMediaUpdate } from './interfaces/media.update.interface';
import { MediaHelper } from './media.helper';

@Injectable()
export class MediaRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<IMedia | undefined> {
    const media = await this.prismaService.media.findUnique({
      where: {
        id,
      },
    });

    if (!media) {
      return undefined;
    }

    return MediaHelper.fromMedia(media);
  }

  async findByObjectKey(objectKey: string): Promise<IMedia | undefined> {
    const media = await this.prismaService.media.findUnique({
      where: {
        objectKey,
      },
    });

    if (!media) {
      return undefined;
    }

    return MediaHelper.fromMedia(media);
  }

  async findByUrl(url: string): Promise<IMedia | undefined> {
    const media = await this.prismaService.media.findUnique({
      where: {
        url,
      },
    });

    if (!media) {
      return undefined;
    }

    return MediaHelper.fromMedia(media);
  }

  async create(data: IMediaCreate): Promise<IMedia> {
    const media = await this.prismaService.media.create({
      data: {
        objectKey: data.objectKey,
        url: data.url,
        status: data.status,
        use: data.use,
        userId: data.userId,
      },
    });

    return MediaHelper.fromMedia(media);
  }

  async updateByObjectKey(objectKey: string, data: IMediaUpdate): Promise<IMedia> {
    const media = await this.prismaService.media.update({
      where: { objectKey },
      data: {
        objectKey: data.objectKey,
        url: data.url,
        status: data.status,
        use: data.use,
        userId: data.userId,
        mimeType: data.mimeType,
      },
    });

    return MediaHelper.fromMedia(media);
  }
}
