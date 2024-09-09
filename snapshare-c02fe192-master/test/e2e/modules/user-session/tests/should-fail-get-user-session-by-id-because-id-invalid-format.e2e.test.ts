import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';

export async function __e2eShouldFailGetUserSessionByIdBecauseIdInvalidFormat(app: INestApplication): Promise<void> {
  const email = 'user-session.get.fail.invalidFormat@example.com';

  const user = await UserFixture.createUser(app, email);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const invalidFormatId = 'invalidFormat-id';

  const response = await request(app.getHttpServer())
    .get(`/user-session/${invalidFormatId}`)
    .auth(accessToken, { type: 'bearer' });

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
