import { EmailType } from '~modules/email/enums/email.type.enum';

import { EmailTemplateVersionContentType } from '../enums/email-template-version.content-type.enum';

export interface IEmailTemplateVersion {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  label: string;
  subject: string;
  content: string;
  contentType: EmailTemplateVersionContentType;
  textContent?: string;
  type?: EmailType;
  style?: string;
  emailTemplateId: string;
}
