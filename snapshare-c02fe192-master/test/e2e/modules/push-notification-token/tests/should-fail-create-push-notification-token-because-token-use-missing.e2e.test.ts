import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';

import { PushNotificationTokenPostDto } from '~modules/push-notification-token/dtos/push-notification-token.post.dto';

export async function __e2eShouldFailCreatePushNotificationTokenBecauseTokenUseMissing(
  app: INestApplication,
): Promise<void> {
  const email = 'push-notification-token.create.fail.tokenMissing@example.com';
  const password = '.Password1';
  const user = await UserFixture.createUser(app, email, password);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const body: Partial<PushNotificationTokenPostDto> = {};

  const response = await request(app.getHttpServer())
    .post('/push-notification-token')
    .auth(accessToken, { type: 'bearer' })
    .send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
