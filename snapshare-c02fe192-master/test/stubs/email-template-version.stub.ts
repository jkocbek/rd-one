import { EmailTemplateVersion } from '@prisma/client';

import { EmailTemplateVersionContentType } from '~modules/email-template-version/enums/email-template-version.content-type.enum';

export const emailTemplateVersionHtmlStub: Partial<EmailTemplateVersion> = {
  id: '3d7ce50d-4ae7-4384-b6d8-812aaf747226',
  label: 'email-template-version-html-stub',
  subject: '[Stub] Html Email Template Version',
  contentType: EmailTemplateVersionContentType.HTML,
  content: 'stub - html content',
  textContent: 'stub - html text content',
};
