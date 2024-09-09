import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { MediaPresignedUrlPostDto } from '~modules/media-presigned-url/dtos/media-presigned-url.post.dto';
import { MediaUse } from '~modules/media/enums/media.use.enum';

export async function __e2eShouldFailCreatePresignedUrlBecauseUserNotAuthenticated(
  app: INestApplication,
): Promise<void> {
  const body: MediaPresignedUrlPostDto = {
    use: (MediaUse as any).EXAMPLE,
  };

  const response = await request(app.getHttpServer()).post('/media-presigned-url').send(body);

  expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
}
