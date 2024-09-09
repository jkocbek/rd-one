import { Injectable } from '@nestjs/common';

import { IPushNotificationTokenCreate } from './interfaces/push-notification-token.create.interface';
import { IPushNotificationTokenFindMany } from './interfaces/push-notification-token.find-many.interface';
import { IPushNotificationToken } from './interfaces/push-notification-token.interface';
import { PushNotificationTokenRepository } from './push-notification-token.repository';

@Injectable()
export class PushNotificationTokenService {
  static readonly LOGGER_KEY = 'push-notification-token-service-logger';

  constructor(private readonly pushNotificationTokenRepository: PushNotificationTokenRepository) {}

  async create(data: IPushNotificationTokenCreate): Promise<IPushNotificationToken> {
    const result = await this.pushNotificationTokenRepository.create(data);
    return result;
  }

  async findById(id: string): Promise<IPushNotificationToken | undefined> {
    const result = await this.pushNotificationTokenRepository.findById(id);
    return result;
  }

  async findMany(query?: IPushNotificationTokenFindMany): Promise<IPushNotificationToken[]> {
    const result = await this.pushNotificationTokenRepository.findMany(query);
    return result;
  }

  async deleteManyByToken(tokens: string[]): Promise<void> {
    await this.pushNotificationTokenRepository.deleteManyByToken(tokens);
  }
}
