import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserSessionFixture } from 'test~fixtures/user-session.fixture';
import { UserFixture } from 'test~fixtures/user.fixture';

export async function __e2eShouldFailGetUserSessionByIdBecauseSessionBelongsToAnotherUser(
  app: INestApplication,
): Promise<void> {
  const email1 = 'user-session.get.fail.sessionBelongsToAnotherUser+user1@example.com';
  const email2 = 'user-session.get.fail.sessionBelongsToAnotherUser+user2@example.com';

  const user1 = await UserFixture.createUser(app, email1);
  const user2 = await UserFixture.createUser(app, email2);

  const accessToken = await UserFixture.createUserAccessToken(app, user1.id);
  await UserFixture.createUserAccessToken(app, user2.id);

  const userSessions = await UserSessionFixture.findManyByUserId(app, user2.id);
  const userSessionId = userSessions[0].id;

  const response = await request(app.getHttpServer())
    .get(`/user-session/${userSessionId}`)
    .auth(accessToken, { type: 'bearer' });

  expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
}
