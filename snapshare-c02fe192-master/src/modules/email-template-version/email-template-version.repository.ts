import { Injectable } from '@nestjs/common';

import { PrismaService } from '~vendors/prisma/prisma.service';

import { EmailType } from '~modules/email/enums/email.type.enum';

import { EmailTemplateVersionHelper } from './email-template-version.helper';
import { IEmailTemplateVersionCreate } from './interfaces/email-template-version.create.interface';
import { IEmailTemplateVersion } from './interfaces/email-template-version.interface';
import { IEmailTemplateVersionList } from './interfaces/email-template-version.list.interface';
import { IEmailTemplateVersionUpdate } from './interfaces/email-template-version.update.interface';

@Injectable()
export class EmailTemplateVersionRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async list(options?: IEmailTemplateVersionList): Promise<IEmailTemplateVersion[]> {
    const emailTemplateVersions = await this.prismaService.emailTemplateVersion.findMany({
      where: {
        id: options?.ids ? { in: options.ids } : undefined,
        emailTemplateId: options?.emailTemplateIds ? { in: options.emailTemplateIds } : undefined,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    return emailTemplateVersions.map((emailTemplateVersion) =>
      EmailTemplateVersionHelper.fromEmailTemplateVersion(emailTemplateVersion),
    );
  }

  async findById(id: string): Promise<IEmailTemplateVersion | undefined> {
    const emailTemplateVersion = await this.prismaService.emailTemplateVersion.findUnique({
      where: { id },
    });

    if (!emailTemplateVersion) {
      return undefined;
    }

    return EmailTemplateVersionHelper.fromEmailTemplateVersion(emailTemplateVersion);
  }

  async findByType(type: EmailType): Promise<IEmailTemplateVersion | undefined> {
    const emailTemplateVersion = await this.prismaService.emailTemplateVersion.findUnique({
      where: { type },
    });

    if (!emailTemplateVersion) {
      return undefined;
    }

    return EmailTemplateVersionHelper.fromEmailTemplateVersion(emailTemplateVersion);
  }

  async create(body: IEmailTemplateVersionCreate): Promise<IEmailTemplateVersion> {
    const emailTemplateVersion = await this.prismaService.emailTemplateVersion.create({
      data: {
        label: body.label,
        subject: body.subject,
        content: body.content,
        contentType: body.contentType,
        textContent: body.textContent,
        style: body.style,
        emailTemplateId: body.emailTemplateId,
      },
    });

    return EmailTemplateVersionHelper.fromEmailTemplateVersion(emailTemplateVersion);
  }

  async update(id: string, body: IEmailTemplateVersionUpdate): Promise<IEmailTemplateVersion> {
    let emailTemplateVersion = await this.prismaService.emailTemplateVersion.findUniqueOrThrow({ where: { id } });

    emailTemplateVersion = await this.prismaService.emailTemplateVersion.update({
      where: { id },
      data: {
        label: body.label,
        subject: body.subject,
        content: body.content,
        contentType: body.contentType,
        textContent: body.textContent,
        type: body.type,
        style: body.style,
        emailTemplateId: body.emailTemplateId,
      },
    });

    return EmailTemplateVersionHelper.fromEmailTemplateVersion(emailTemplateVersion);
  }

  async clearType(type: EmailType): Promise<void> {
    await this.prismaService.emailTemplateVersion.updateMany({ where: { type }, data: { type: null } });
  }

  async delete(id: string): Promise<void> {
    await this.prismaService.emailTemplateVersion.delete({ where: { id } });
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.prismaService.emailTemplateVersion.deleteMany({ where: { id: { in: ids } } });
  }
}
