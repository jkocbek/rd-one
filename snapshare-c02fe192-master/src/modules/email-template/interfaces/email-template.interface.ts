import { IEmailTemplateVersion } from '~modules/email-template-version/interfaces/email-template-version.interface';

export interface IEmailTemplate {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  name: string;
  description?: string;
  emailTemplateVersions: IEmailTemplateVersion[];
}
