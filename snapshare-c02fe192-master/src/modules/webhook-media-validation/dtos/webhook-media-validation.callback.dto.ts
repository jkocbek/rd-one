import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { IWebhookMediaValidationCallback } from '../interfaces/webhook-media-validation.callback.interface';

export class WebhookMediaValidationCallbackDto {
  @Expose()
  @ApiProperty({ description: 'Event Type' })
  readonly eventName!: string;

  @Expose()
  @ApiProperty({ description: 'Bucket Name' })
  readonly bucketName!: string;

  @Expose()
  @ApiProperty({ description: 'Object Key' })
  readonly objectKey!: string;

  static create(data: IWebhookMediaValidationCallback): WebhookMediaValidationCallbackDto {
    return plainToValidatedInstance(WebhookMediaValidationCallbackDto, data);
  }
}
