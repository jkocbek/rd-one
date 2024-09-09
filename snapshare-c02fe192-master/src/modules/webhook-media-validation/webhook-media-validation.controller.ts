import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { WebhookMediaValidationCallbackDto } from './dtos/webhook-media-validation.callback.dto';
import { WebhookMediaValidationCallbackAuthorizationGuard } from './guards/webhook-media-validation.callback.authorization.guard';
import { WEBHOOK_MEDIA_VALIDATION_CALLBACK_AUTHORIZATION_HEADER } from './webhook-media-validation.constants';
import { WebhookMediaValidationService } from './webhook-media-validation.service';

@ApiTags('Webhook Media Validation')
@Controller('webhook-media-validation')
export class WebhookMediaValidationController {
  constructor(private readonly webhookMediaValidationService: WebhookMediaValidationService) {}

  @ApiHeader({
    name: WEBHOOK_MEDIA_VALIDATION_CALLBACK_AUTHORIZATION_HEADER,
    description: 'Webhook Media Validation Authorization Header',
    required: false,
  })
  @UseGuards(WebhookMediaValidationCallbackAuthorizationGuard)
  @Post('/callback')
  @ApiOperation({ summary: 'Media Upload Callback' })
  async mediaUploadCallback(@Req() request: Request): Promise<void> {
    const body = WebhookMediaValidationCallbackDto.create(request.body);

    await this.webhookMediaValidationService.uploadedMediaCallback(body);
  }
}
