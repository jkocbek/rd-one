import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserSessionFixture } from 'test~fixtures/user-session.fixture';
import { UserFixture } from 'test~fixtures/user.fixture';

export async function __e2eShouldFailGetUserSessionByIdBecauseUnathorized(app: INestApplication): Promise<void> {
  const email = 'user-session.get.fail.unauthorized@example.com';

  const user = await UserFixture.createUser(app, email);

  await UserFixture.createUserAccessToken(app, user.id);

  const userSessions = await UserSessionFixture.findManyByUserId(app, user.id);
  const userSessionId = userSessions[0].id;

  const response = await request(app.getHttpServer()).get(`/user-session/${userSessionId}`);

  expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
}
