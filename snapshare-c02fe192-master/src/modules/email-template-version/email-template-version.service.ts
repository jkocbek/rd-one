import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';

import { EmailType } from '~modules/email/enums/email.type.enum';

import { EmailTemplateVersionHelper } from './email-template-version.helper';
import { EmailTemplateVersionRepository } from './email-template-version.repository';
import { IEmailTemplateVersionCreate } from './interfaces/email-template-version.create.interface';
import { IEmailTemplateVersion } from './interfaces/email-template-version.interface';
import { IEmailTemplateVersionList } from './interfaces/email-template-version.list.interface';
import { IEmailTemplateVersionUpdate } from './interfaces/email-template-version.update.interface';

@Injectable()
export class EmailTemplateVersionService {
  static readonly LOGGER_KEY = 'email-template-version-service-logger';

  constructor(
    @Inject(EmailTemplateVersionService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly emailTemplateVersionRepository: EmailTemplateVersionRepository,
  ) {}

  async list(options?: IEmailTemplateVersionList): Promise<IEmailTemplateVersion[]> {
    const result = await this.emailTemplateVersionRepository.list(options);
    return result;
  }

  async findById(id: string): Promise<IEmailTemplateVersion | undefined> {
    const result = await this.emailTemplateVersionRepository.findById(id);
    return result;
  }

  async findByIdOrThrow(id: string): Promise<IEmailTemplateVersion> {
    const result = await this.emailTemplateVersionRepository.findById(id);
    if (!result) {
      this.logger.error(`Could not find email template version ${id}.`);
      throw new NotFoundException(`Email template version not found.`);
    }

    return result;
  }

  async findByType(type: EmailType): Promise<IEmailTemplateVersion | undefined> {
    const result = await this.emailTemplateVersionRepository.findByType(type);
    return result;
  }

  async findByTypeOrThrow(type: EmailType): Promise<IEmailTemplateVersion> {
    const result = await this.emailTemplateVersionRepository.findByType(type);

    if (!result) {
      this.logger.warn(`Could not found email template version by type '${type}'.`);
      throw new NotFoundException('Email template version by type not found.');
    }

    return result;
  }

  async create(body: IEmailTemplateVersionCreate): Promise<IEmailTemplateVersion> {
    const result = await this.emailTemplateVersionRepository.create(body);
    return result;
  }

  async update(id: string, body: IEmailTemplateVersionUpdate): Promise<IEmailTemplateVersion> {
    const result = await this.emailTemplateVersionRepository.update(id, body);
    return result;
  }

  async duplicate(id: string, emailTemplateId?: string): Promise<IEmailTemplateVersion> {
    const existingEmailTemplate = await this.findByIdOrThrow(id);

    const duplicateData = EmailTemplateVersionHelper.generateDuplicateData(existingEmailTemplate, emailTemplateId);
    const result = this.create(duplicateData);

    return result;
  }

  async clearType(type: EmailType): Promise<void> {
    await this.emailTemplateVersionRepository.clearType(type);
  }

  async delete(id: string): Promise<void> {
    await this.emailTemplateVersionRepository.delete(id);
  }

  async deleteMany(ids: string[]): Promise<void> {
    await this.emailTemplateVersionRepository.deleteMany(ids);
  }
}
