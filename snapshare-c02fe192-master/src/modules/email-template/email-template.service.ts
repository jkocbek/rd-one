import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { EmailTemplateVersionService } from '~modules/email-template-version/email-template-version.service';

import { EmailTemplateHelper } from './email-template.helper';
import { EmailTemplateRepository } from './email-template.repository';
import { IEmailTemplateCreate } from './interfaces/email-template.create.interface';
import { IEmailTemplate } from './interfaces/email-template.interface';
import { IEmailTemplateList } from './interfaces/email-template.list.interface';
import { IEmailTemplateUpdate } from './interfaces/email-template.update.interface';

@Injectable()
export class EmailTemplateService {
  static readonly LOGGER_KEY = 'email-template-service-logger';

  constructor(
    @Inject(EmailTemplateService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly emailTemplateRepository: EmailTemplateRepository,
    private readonly emailTemplateVersionService: EmailTemplateVersionService,
  ) {}

  async list(options?: IEmailTemplateList): Promise<IEmailTemplate[]> {
    const result = await this.emailTemplateRepository.list(options);
    return result;
  }

  async findById(id: string): Promise<IEmailTemplate | undefined> {
    const result = await this.emailTemplateRepository.findById(id);
    return result;
  }

  async findByIdOrThrow(id: string): Promise<IEmailTemplate> {
    const result = await this.emailTemplateRepository.findById(id);
    if (!result) {
      this.logger.error(`Could not find email template ${id}.`);
      throw new NotFoundException(`Email template ${id} not found.`);
    }

    return result;
  }

  async create(data: IEmailTemplateCreate): Promise<IEmailTemplate> {
    const result = await this.emailTemplateRepository.create(data);
    return result;
  }

  async update(id: string, data: IEmailTemplateUpdate): Promise<IEmailTemplate> {
    const result = await this.emailTemplateRepository.update(id, data);
    return result;
  }

  async duplicate(id: string): Promise<IEmailTemplate> {
    const existingEmailTemplate = await this.findByIdOrThrow(id);

    const duplicateData = EmailTemplateHelper.generateDuplicateData(existingEmailTemplate);
    let result = await this.create(duplicateData);

    for (const emailTemplateVersion of existingEmailTemplate.emailTemplateVersions) {
      await this.emailTemplateVersionService.duplicate(emailTemplateVersion.id, result.id);
    }

    result = await this.findByIdOrThrow(result.id);

    return result;
  }

  async delete(id: string): Promise<void> {
    await this.emailTemplateRepository.delete(id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.emailTemplateRepository.deleteMany(ids);
  }
}
