import { EmailTemplateVersionContentType } from '../enums/email-template-version.content-type.enum';

export interface IEmailTemplateVersionCreate {
  label: string;
  subject: string;
  content: string;
  contentType: EmailTemplateVersionContentType;
  textContent?: string;
  style?: string;
  emailTemplateId: string;
}
