import { INestApplication } from '@nestjs/common';
import { EmailTemplate } from '@prisma/client';

import { PrismaService } from '~vendors/prisma/prisma.service';

export class EmailTemplateFixture {
  static async createTemplate(app: INestApplication, name: string, description?: string): Promise<EmailTemplate> {
    const prisma = app.get<PrismaService>(PrismaService);

    const emailTemplate = await prisma.emailTemplate.create({ data: { name, description } });

    return emailTemplate;
  }
}
