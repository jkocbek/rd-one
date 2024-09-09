import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';

import { AuthLoginDto } from '~modules/auth/dtos/auth.login.dto';

export async function __e2eShouldFailLoginBecauseInvalidPassword(app: INestApplication): Promise<void> {
  const email = 'auth.login.error.badRequest.invalidPassword@example.com';
  const password = '.Password1';

  await UserFixture.createUser(app, email, password);

  const body: AuthLoginDto = {
    email,
    password: '.invalidPassword1',
  };

  const response = await request(app.getHttpServer()).post('/auth/login').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
