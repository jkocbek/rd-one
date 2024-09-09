import { INestApplication } from '@nestjs/common';
import { PasswordForgot } from '@prisma/client';
import { DateTime } from 'luxon';

import { PrismaService } from '~vendors/prisma/prisma.service';

export class PasswordForgotFixture {
  static async createCode(app: INestApplication, userId: string, code: string): Promise<PasswordForgot> {
    const prisma = app.get<PrismaService>(PrismaService);

    const expireAt = DateTime.now().plus({ day: 1 }).toJSDate();
    const passwordForgot = await prisma.passwordForgot.create({ data: { userId, code, expireAt } });

    return passwordForgot;
  }

  static async createExpiredCode(app: INestApplication, userId: string, code: string): Promise<PasswordForgot> {
    const prisma = app.get<PrismaService>(PrismaService);

    const expireAt = DateTime.now().minus({ minute: 1 }).toJSDate();
    const passwordForgot = await prisma.passwordForgot.create({ data: { userId, code, expireAt } });

    return passwordForgot;
  }
}
