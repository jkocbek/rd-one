import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';

import { UserDto } from '~modules/user/dtos/user.dto';

export async function __e2eShouldSuccessfullyGetUserById(app: INestApplication): Promise<void> {
  const email = 'user.get.success@example.com';

  const user = await UserFixture.createUser(app, email);

  const response = await request(app.getHttpServer()).get(`/user/${user.id}`);

  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.body as UserDto;

  expect(responseBody.id).toStrictEqual(user.id);
  expect(responseBody.email).toStrictEqual(email);
}
