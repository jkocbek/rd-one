import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';

import { makeUUID } from '~utils/uuid';

export async function __e2eShouldFailGetUserSessionByIdBecauseSessionNotFound(app: INestApplication): Promise<void> {
  const email = 'user-session.get.fail.notFound@example.com';

  const user = await UserFixture.createUser(app, email);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const notFoundId = makeUUID();

  const response = await request(app.getHttpServer())
    .get(`/user-session/${notFoundId}`)
    .auth(accessToken, { type: 'bearer' });

  expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
}
