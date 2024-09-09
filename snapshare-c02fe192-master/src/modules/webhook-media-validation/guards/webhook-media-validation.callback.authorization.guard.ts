import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';

import { WebhookMediaValidationConfig } from '../webhook-media-validation.config';
import { WEBHOOK_MEDIA_VALIDATION_CALLBACK_AUTHORIZATION_HEADER } from '../webhook-media-validation.constants';

@Injectable()
export class WebhookMediaValidationCallbackAuthorizationGuard implements CanActivate {
  constructor(private readonly webhookMediaConfig: WebhookMediaValidationConfig) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { callbackHeaderAuthentication } = this.webhookMediaConfig;
    if (!callbackHeaderAuthentication) {
      return true;
    }

    const request = context.switchToHttp().getRequest() as Request;
    const header = request.header(WEBHOOK_MEDIA_VALIDATION_CALLBACK_AUTHORIZATION_HEADER);
    if (!header || header !== callbackHeaderAuthentication) {
      return false;
    }

    return true;
  }
}
