import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';
import { mediaPresignedUrlPutStub } from 'test~stubs/media-upload-provider-s3-put.stub';

import { MediaPresignedUrlDto } from '~modules/media-presigned-url/dtos/media-presigned-url.dto';
import { MediaPresignedUrlPostDto } from '~modules/media-presigned-url/dtos/media-presigned-url.post.dto';
import { MediaUse } from '~modules/media/enums/media.use.enum';

export async function __e2eShouldSuccessfullyCreatePresignedUrl(app: INestApplication): Promise<void> {
  const email = 'media-presigned-url.create.success@example.com';
  const password = '.Password1';
  const user = await UserFixture.createUser(app, email, password);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const body: MediaPresignedUrlPostDto = {
    use: (MediaUse as any).EXAMPLE,
  };

  const response = await request(app.getHttpServer())
    .post('/media-presigned-url')
    .auth(accessToken, { type: 'bearer' })
    .send(body);

  expect(response.statusCode).toBe(HttpStatus.CREATED);

  const responseBody = response.body as MediaPresignedUrlDto;

  expect(responseBody.fields).toStrictEqual(mediaPresignedUrlPutStub.fields);
  expect(responseBody.mediaUrl).toStrictEqual(mediaPresignedUrlPutStub.mediaUrl);
  expect(responseBody.uploadMethod).toStrictEqual(mediaPresignedUrlPutStub.uploadMethod);
  expect(responseBody.uploadUrl).toStrictEqual(mediaPresignedUrlPutStub.uploadUrl);
}
