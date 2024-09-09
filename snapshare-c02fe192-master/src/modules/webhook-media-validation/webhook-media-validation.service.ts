import { Inject, Injectable, Logger } from '@nestjs/common';

import { MediaValidationService } from '~modules/media-validation/media-validation.service';

import { IWebhookMediaValidationCallback } from './interfaces/webhook-media-validation.callback.interface';

@Injectable()
export class WebhookMediaValidationService {
  static readonly LOGGER_KEY = 'webhook-media-validation-service-logger';

  constructor(
    @Inject(WebhookMediaValidationService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly mediaValidationService: MediaValidationService,
  ) {}

  async uploadedMediaCallback(data: IWebhookMediaValidationCallback): Promise<void> {
    const { objectKey } = data;

    try {
      await this.mediaValidationService.validateByObjectKey(objectKey);
    } catch (err) {
      this.logger.warn(`Error occurred validation media in callback: `, err);
    }
  }
}
