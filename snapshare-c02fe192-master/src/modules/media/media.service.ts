import { Injectable } from '@nestjs/common';

import { IMediaCreate } from './interfaces/media.create.interface';
import { IMedia } from './interfaces/media.interface';
import { IMediaUpdate } from './interfaces/media.update.interface';
import { MediaRepository } from './media.repository';

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  async findById(id: string): Promise<IMedia | undefined> {
    const result = await this.mediaRepository.findById(id);
    return result;
  }

  async findByObjectKey(objectKey: string): Promise<IMedia | undefined> {
    const result = await this.mediaRepository.findByObjectKey(objectKey);
    return result;
  }

  async findByUrl(url: string): Promise<IMedia | undefined> {
    const result = await this.mediaRepository.findByUrl(url);
    return result;
  }

  async create(data: IMediaCreate): Promise<IMedia> {
    const result = await this.mediaRepository.create(data);
    return result;
  }

  async updateByObjectKey(objectKey: string, data: IMediaUpdate): Promise<IMedia> {
    const result = await this.mediaRepository.updateByObjectKey(objectKey, data);
    return result;
  }
}
