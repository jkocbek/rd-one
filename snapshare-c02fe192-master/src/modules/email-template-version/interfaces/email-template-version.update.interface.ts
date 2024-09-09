import { EmailType } from '~modules/email/enums/email.type.enum';

import { EmailTemplateVersionContentType } from '../enums/email-template-version.content-type.enum';

export interface IEmailTemplateVersionUpdate {
  label?: string;
  subject?: string;
  content?: string;
  contentType?: EmailTemplateVersionContentType;
  textContent?: string | null;
  type?: EmailType;
  style?: string;
  emailTemplateId?: string;
}
