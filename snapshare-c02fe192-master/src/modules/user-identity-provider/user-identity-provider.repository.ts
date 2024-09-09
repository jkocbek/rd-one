import { Injectable } from '@nestjs/common';

import { PrismaService } from '~vendors/prisma/prisma.service';

import { IUserIdentityProviderCreate } from './interfaces/user-identity-provider.create.interface';
import { IUserIdentityProviderFind } from './interfaces/user-identity-provider.find.interface';
import { IUserIdentityProvider } from './interfaces/user-identity-provider.interface';
import { IUserIdentityProviderUpdate } from './interfaces/user-identity-provider.update.interface';
import { UserIdentityProviderHelper } from './user-identity-provider.helper';

@Injectable()
export class UserIdentityProviderRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async find(data: IUserIdentityProviderFind): Promise<IUserIdentityProvider | undefined> {
    const userIdentityProvider = await this.prismaService.userIdentityProvider.findFirst({
      where: {
        sub: data.sub,
        source: data.source ? (data.source as unknown as string) : undefined,
        integration: data.integration,
      },
      include: {
        user: true,
      },
    });

    if (!userIdentityProvider) {
      return undefined;
    }

    return UserIdentityProviderHelper.fromUserIdentityProvider(userIdentityProvider);
  }

  async findById(id: string): Promise<IUserIdentityProvider | undefined> {
    const userIdentityProvider = await this.prismaService.userIdentityProvider.findFirst({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });

    if (!userIdentityProvider) {
      return undefined;
    }

    return UserIdentityProviderHelper.fromUserIdentityProvider(userIdentityProvider);
  }

  async create(data: IUserIdentityProviderCreate): Promise<IUserIdentityProvider> {
    const userIdentityProvider = await this.prismaService.userIdentityProvider.create({
      data: {
        sub: data.sub,
        source: data.source ? (data.source as unknown as string) : undefined,
        integration: data.integration,
        userId: data.userId,
        emailVerified: data.emailVerified,
      },
      include: {
        user: true,
      },
    });

    return UserIdentityProviderHelper.fromUserIdentityProvider(userIdentityProvider);
  }

  async update(id: string, data: IUserIdentityProviderUpdate): Promise<IUserIdentityProvider> {
    const userIdentityProvider = await this.prismaService.userIdentityProvider.update({
      where: {
        id,
      },
      data: {
        sub: data.sub,
        source: data.source ? (data.source as unknown as string) : undefined,
        integration: data.integration,
        userId: data.userId,
        emailVerified: data.emailVerified,
      },
      include: {
        user: true,
      },
    });

    return UserIdentityProviderHelper.fromUserIdentityProvider(userIdentityProvider);
  }
}
