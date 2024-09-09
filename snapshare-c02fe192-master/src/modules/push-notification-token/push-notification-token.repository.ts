import { Injectable } from '@nestjs/common';

import { PrismaService } from '~vendors/prisma/prisma.service';

import { IPushNotificationTokenCreate } from './interfaces/push-notification-token.create.interface';
import { IPushNotificationTokenFindMany } from './interfaces/push-notification-token.find-many.interface';
import { IPushNotificationToken } from './interfaces/push-notification-token.interface';
import { PushNotificationTokenHelper } from './push-notification-token.helper';

@Injectable()
export class PushNotificationTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: IPushNotificationTokenCreate): Promise<IPushNotificationToken> {
    const entity = await this.prismaService.pushNotificationToken.create({
      data: {
        userId: data.userId,
        token: data.token,
      },
    });

    return PushNotificationTokenHelper.fromPushNotificationToken(entity);
  }

  async findById(id: string): Promise<IPushNotificationToken | undefined> {
    const entity = await this.prismaService.pushNotificationToken.findUnique({
      where: { id },
    });

    if (!entity) {
      return undefined;
    }

    return PushNotificationTokenHelper.fromPushNotificationToken(entity);
  }

  async findMany(query?: IPushNotificationTokenFindMany): Promise<IPushNotificationToken[]> {
    const entities = await this.prismaService.pushNotificationToken.findMany({
      where: {
        userId: query?.userId,
      },
    });

    return entities.map((entity) => PushNotificationTokenHelper.fromPushNotificationToken(entity));
  }

  async deleteManyByToken(tokens: string[]): Promise<void> {
    await this.prismaService.pushNotificationToken.deleteMany({
      where: {
        token: {
          in: tokens,
        },
      },
    });
  }
}
