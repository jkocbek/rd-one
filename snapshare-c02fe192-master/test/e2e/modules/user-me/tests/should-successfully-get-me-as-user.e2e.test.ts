import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';

import { UserMeDto } from '~modules/user-me/dtos/user-me.dto';

export async function __e2eShouldSuccessfullyGetMeAsUser(app: INestApplication): Promise<void> {
  const email = 'user-me.get.success@example.com';

  const user = await UserFixture.createUser(app, email);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);

  const response = await request(app.getHttpServer()).get('/user-me').auth(accessToken, { type: 'bearer' });

  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.body as UserMeDto;

  expect(responseBody.email).toStrictEqual(email);
  expect(responseBody.email).toStrictEqual(user.email);
  expect(responseBody.id).toStrictEqual(user.id);
}
