import { Inject, Injectable, Logger, NotImplementedException } from '@nestjs/common';

import { EmailProviderAwsSesService } from '~vendors/email-provider-aws-ses/email-provider-aws-ses.service';

import { EmailTemplateVersionService } from '~modules/email-template-version/email-template-version.service';
import { EmailTemplateVersionContentType } from '~modules/email-template-version/enums/email-template-version.content-type.enum';
import { IEmailTemplateVersion } from '~modules/email-template-version/interfaces/email-template-version.interface';
import { EmailType } from '~modules/email/enums/email.type.enum';

import { IEmailSendOptions } from './interfaces/email.send.options.interface';
import { EmailTemplateVariables } from './types/email.template-variable.type';
import { generateHtmlEmailContent } from './utils/email.html.util';
import { mjmlToHtml } from './utils/email.mjml.util';

@Injectable()
export class EmailService {
  static readonly LOGGER_KEY = 'email-service-logger';

  constructor(
    @Inject(EmailService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly emailTemplateVersionService: EmailTemplateVersionService,
    private readonly emailProviderAwsSesService: EmailProviderAwsSesService,
  ) {}

  async sendEmailByType<TemplateType extends EmailType>(
    email: string,
    type: TemplateType,
    templateVars: EmailTemplateVariables[TemplateType],
    options?: IEmailSendOptions,
  ): Promise<void> {
    try {
      const emailTemplateVersion = await this.emailTemplateVersionService.findByTypeOrThrow(type);
      await this.processEmail(email, templateVars, emailTemplateVersion);
    } catch (err) {
      if (options?.throwOnError) {
        this.logger.error(`Error occurred sending email by type to ${email} with type ${type}. Err: `, err);
        throw err;
      }

      this.logger.warn(
        `Silent skip ... Error occurred sending email by type to ${email} with type ${type}. Err: `,
        err,
      );
    }
  }

  async sendEmailByEmailTemplateVersion<TemplateType extends EmailType>(
    email: string,
    emailTemplateVersionId: string,
    templateVars: EmailTemplateVariables[TemplateType],
    options?: IEmailSendOptions,
  ): Promise<void> {
    try {
      const emailTemplateVersion = await this.emailTemplateVersionService.findByIdOrThrow(emailTemplateVersionId);
      await this.processEmail(email, templateVars, emailTemplateVersion);
    } catch (err) {
      if (options?.throwOnError) {
        this.logger.error(
          `Error occurred sending email by email template version to ${email} with template version id ${emailTemplateVersionId}. Err: `,
          err,
        );
        throw err;
      }

      this.logger.warn(
        `Silent skip ... Error occurred sending email by email template version to ${email} with template version id ${emailTemplateVersionId}. Err: `,
        err,
      );
    }
  }

  private async processEmail<TemplateType extends EmailType>(
    email: string,
    templateVars: EmailTemplateVariables[TemplateType],
    emailTemplateVersion: IEmailTemplateVersion,
  ): Promise<void> {
    let htmlContent: string | undefined;
    switch (emailTemplateVersion.contentType) {
      case EmailTemplateVersionContentType.MJML: {
        htmlContent = mjmlToHtml(emailTemplateVersion.content);
        break;
      }

      case EmailTemplateVersionContentType.HTML: {
        htmlContent = generateHtmlEmailContent(emailTemplateVersion.content, emailTemplateVersion.style);
        break;
      }

      default: {
        this.logger.warn(
          `Email template version ${emailTemplateVersion.id} has unsupported content type ${emailTemplateVersion.contentType}.`,
        );
        throw new NotImplementedException(
          `Email template version content type ${emailTemplateVersion.contentType} is not supported.`,
        );
      }
    }

    const textContent = emailTemplateVersion.textContent;

    await this.emailProviderAwsSesService.sendEmail(
      email,
      emailTemplateVersion.subject,
      htmlContent,
      templateVars,
      textContent,
    );
  }
}
