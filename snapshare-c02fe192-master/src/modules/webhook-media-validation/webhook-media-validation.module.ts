import { DynamicModule, Logger, Module } from '@nestjs/common';

import { getConfigFactory, getConfig } from '~common/config';

import { MediaValidationModule } from '~modules/media-validation/media-validation.module';

import { WebhookMediaValidationConfig } from './webhook-media-validation.config';
import { WebhookMediaValidationController } from './webhook-media-validation.controller';
import { WebhookMediaValidationService } from './webhook-media-validation.service';

const webhookMediaValidationConfig = getConfig(WebhookMediaValidationConfig);

@Module({})
export class WebhookMediaValidationModule {
  static forRootOptionalAsync(): DynamicModule {
    if (webhookMediaValidationConfig?.enabled) {
      return {
        module: WebhookMediaValidationModule,
        imports: [MediaValidationModule],
        controllers: [WebhookMediaValidationController],
        providers: [
          getConfigFactory(WebhookMediaValidationConfig),
          {
            provide: WebhookMediaValidationService.LOGGER_KEY,
            useValue: new Logger(WebhookMediaValidationService.name),
          },
          WebhookMediaValidationService,
        ],
        exports: [WebhookMediaValidationService],
      };
    }

    return {
      module: WebhookMediaValidationModule,
    };
  }
}
