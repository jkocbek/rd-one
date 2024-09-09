import { EmailTemplate, EmailTemplateVersion } from '@prisma/client';

import { EmailTemplateVersionHelper } from '~modules/email-template-version/email-template-version.helper';

import { IEmailTemplateCreate } from './interfaces/email-template.create.interface';
import { IEmailTemplate } from './interfaces/email-template.interface';

export class EmailTemplateHelper {
  static fromEmailTemplate(
    emailTemplate: EmailTemplate & { emailTemplateVersions: EmailTemplateVersion[] },
  ): IEmailTemplate {
    const emailTemplateVersions = emailTemplate.emailTemplateVersions.map((emailTemplateVersion) =>
      EmailTemplateVersionHelper.fromEmailTemplateVersion(emailTemplateVersion),
    );

    return {
      id: emailTemplate.id,
      name: emailTemplate.name,
      description: emailTemplate.description ?? undefined,
      createdAt: emailTemplate.createdAt,
      updatedAt: emailTemplate.updatedAt,
      emailTemplateVersions,
    };
  }

  static generateDuplicateData(emailTemplate: IEmailTemplate): IEmailTemplateCreate {
    return {
      name: `${emailTemplate.name} (2)`,
      description: emailTemplate.description,
    };
  }
}
