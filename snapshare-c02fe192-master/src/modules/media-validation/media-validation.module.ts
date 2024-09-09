import { Global, Logger, Module } from '@nestjs/common';

import { MediaPresignedUrlModule } from '~modules/media-presigned-url/media-presigned-url.module';
import { MediaModule } from '~modules/media/media.module';

import { MediaValidationService } from './media-validation.service';

@Global()
@Module({
  imports: [MediaModule, MediaPresignedUrlModule],
  providers: [
    {
      provide: MediaValidationService.LOGGER_KEY,
      useValue: new Logger(MediaValidationService.name),
    },
    MediaValidationService,
  ],
  exports: [MediaValidationService],
})
export class MediaValidationModule {}
