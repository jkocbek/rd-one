import { Injectable } from '@nestjs/common';

import { PrismaService } from '~vendors/prisma/prisma.service';

import { IRefreshTokenCreate } from './interfaces/refresh-token.create.interface';
import { IRefreshToken } from './interfaces/refresh-token.interface';
import { IRefreshTokenUpdate } from './interfaces/refresh-token.update.interface';
import { RefreshTokenHelper } from './refresh-token.helper';

@Injectable()
export class RefreshTokenRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(data: IRefreshTokenCreate): Promise<IRefreshToken> {
    const refreshToken = await this.prismaService.refreshToken.create({
      data: {
        token: data.token,
        expireAt: data.expireAt,
        userId: data.userId,
        userSessionId: data.userSessionId,
      },
    });

    return RefreshTokenHelper.fromRefreshToken(refreshToken);
  }

  async updateByUserSessionId(userSessionId: string, data: IRefreshTokenUpdate): Promise<IRefreshToken> {
    const refreshToken = await this.prismaService.refreshToken.update({
      where: {
        userSessionId,
      },
      data: {
        token: data.token,
        expireAt: data.expireAt,
        userSessionId: data.userSessionId,
      },
    });

    return RefreshTokenHelper.fromRefreshToken(refreshToken);
  }

  async findById(id: string): Promise<IRefreshToken | undefined> {
    const refreshToken = await this.prismaService.refreshToken.findUnique({
      where: {
        id,
      },
    });

    if (!refreshToken) {
      return undefined;
    }

    return RefreshTokenHelper.fromRefreshToken(refreshToken);
  }

  async findByUserSessionId(userSessionId: string): Promise<IRefreshToken | undefined> {
    const refreshToken = await this.prismaService.refreshToken.findUnique({
      where: {
        userSessionId,
      },
    });

    if (!refreshToken) {
      return undefined;
    }

    return RefreshTokenHelper.fromRefreshToken(refreshToken);
  }

  async deleteById(id: string): Promise<void> {
    await this.prismaService.refreshToken.delete({
      where: {
        id,
      },
    });
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.prismaService.refreshToken.deleteMany({
      where: {
        userId,
      },
    });
  }
}
