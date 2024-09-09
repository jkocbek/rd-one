import { Logger, Module } from '@nestjs/common';

import { EmailTemplateVersionRepository } from './email-template-version.repository';
import { EmailTemplateVersionService } from './email-template-version.service';

@Module({
  providers: [
    {
      provide: EmailTemplateVersionService.LOGGER_KEY,
      useValue: new Logger(EmailTemplateVersionService.name),
    },
    EmailTemplateVersionRepository,
    EmailTemplateVersionService,
  ],
  exports: [EmailTemplateVersionService],
})
export class EmailTemplateVersionModule {}
