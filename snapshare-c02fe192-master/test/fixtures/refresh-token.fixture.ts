import { INestApplication } from '@nestjs/common';
import { RefreshToken } from '@prisma/client';

import { PrismaService } from '~vendors/prisma/prisma.service';

export class RefreshTokenFixture {
  static async findManyByUserId(app: INestApplication, userId: string): Promise<RefreshToken[]> {
    const prisma = app.get<PrismaService>(PrismaService);

    const refreshTokens = await prisma.refreshToken.findMany({ where: { userId } });

    return refreshTokens;
  }

  static async findByToken(app: INestApplication, token: string): Promise<RefreshToken | undefined> {
    const prisma = app.get<PrismaService>(PrismaService);

    const refreshToken = await prisma.refreshToken.findUnique({ where: { token } });

    return refreshToken ?? undefined;
  }
}
