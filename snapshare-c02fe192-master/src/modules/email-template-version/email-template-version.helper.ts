import { EmailTemplateVersion } from '@prisma/client';

import { EmailHelper } from '~modules/email/email.helper';

import { EmailTemplateVersionContentType } from './enums/email-template-version.content-type.enum';
import { IEmailTemplateVersionCreate } from './interfaces/email-template-version.create.interface';
import { IEmailTemplateVersion } from './interfaces/email-template-version.interface';

export class EmailTemplateVersionHelper {
  static fromEmailTemplateVersion(emailTemplateVersion: EmailTemplateVersion): IEmailTemplateVersion {
    return {
      id: emailTemplateVersion.id,
      label: emailTemplateVersion.label,
      subject: emailTemplateVersion.subject,
      content: emailTemplateVersion.content,
      contentType: EmailTemplateVersionHelper.parseEmailTemplateVersionContentType(emailTemplateVersion.contentType),
      textContent: emailTemplateVersion.textContent ?? undefined,
      emailTemplateId: emailTemplateVersion.emailTemplateId,
      type: emailTemplateVersion.type ? EmailHelper.parseEmailType(emailTemplateVersion.type) : undefined,
      style: emailTemplateVersion.style ?? undefined,
      createdAt: emailTemplateVersion.createdAt,
      updatedAt: emailTemplateVersion.updatedAt,
    };
  }

  static parseEmailTemplateVersionContentType(stringifiedEnum: string): EmailTemplateVersionContentType {
    const status = EmailTemplateVersionContentType[stringifiedEnum as keyof typeof EmailTemplateVersionContentType];
    return status;
  }

  static generateDuplicateData(
    emailTemplateVersion: IEmailTemplateVersion,
    emailTemplateId?: string,
  ): IEmailTemplateVersionCreate {
    const label = emailTemplateId ? emailTemplateVersion.label : `${emailTemplateVersion.label} (2)`;

    return {
      label,
      subject: emailTemplateVersion.subject,
      content: emailTemplateVersion.content,
      contentType: emailTemplateVersion.contentType,
      textContent: emailTemplateVersion.textContent,
      style: emailTemplateVersion.style,
      emailTemplateId: emailTemplateId ?? emailTemplateVersion.emailTemplateId,
    };
  }
}
