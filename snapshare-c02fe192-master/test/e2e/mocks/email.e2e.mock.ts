import { createMock } from '@golevelup/ts-jest';
import { INestApplication } from '@nestjs/common';
import { ITestNestSetupProviderOverride } from 'test~interfaces/nest-setup.test.provider-override.interface';
import { emailTemplateVersionHtmlStub } from 'test~stubs/email-template-version.stub';

import { EmailProviderAwsSesService } from '~vendors/email-provider-aws-ses/email-provider-aws-ses.service';

import { EmailTemplateVersionService } from '~modules/email-template-version/email-template-version.service';

export const e2eMockEmail: ITestNestSetupProviderOverride[] = [
  { typeOrToken: EmailProviderAwsSesService, value: createMock<EmailProviderAwsSesService>({}) },
  {
    typeOrToken: EmailTemplateVersionService,
    value: createMock<EmailTemplateVersionService>({
      findByTypeOrThrow: jest.fn().mockReturnValue(emailTemplateVersionHtmlStub),
    }),
  },
];

export function e2eMockEmailClear(app: INestApplication): void {
  const emailProviderAwsSesService = app.get(EmailProviderAwsSesService);
  jest.spyOn(emailProviderAwsSesService, 'sendEmail').mockClear();
}

export function e2eMockEmailSpyOnSendEmail(app: INestApplication) {
  const emailProviderAwsSesService = app.get(EmailProviderAwsSesService);
  return jest.spyOn(emailProviderAwsSesService, 'sendEmail');
}
