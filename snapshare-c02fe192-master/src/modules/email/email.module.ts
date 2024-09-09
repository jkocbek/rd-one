import { Global, Logger, Module } from '@nestjs/common';

import { getConfig } from '~common/config';

import { EmailProviderAwsSesModule } from '~vendors/email-provider-aws-ses/email-provider-aws-ses.module';

import { EmailTemplateVersionModule } from '~modules/email-template-version/email-template-version.module';

import { EmailConfig } from './email.config';
import { EmailService } from './email.service';

const emailConfig = getConfig(EmailConfig);

@Global()
@Module({
  imports: [
    EmailProviderAwsSesModule.forRoot({
      accessKeyId: emailConfig.accessKeyId,
      secretAccessKey: emailConfig.secretAccessKey,
      emailFrom: emailConfig.emailFrom,
      region: emailConfig.region,
      apiEndpoint: emailConfig.apiEndpoint,
    }),
    EmailTemplateVersionModule,
  ],
  providers: [
    {
      provide: EmailService.LOGGER_KEY,
      useValue: new Logger(EmailService.name),
    },
    EmailService,
  ],
  exports: [EmailService],
})
export class EmailModule {}
