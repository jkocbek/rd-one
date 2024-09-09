import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';

import { AuthLoginDto } from '~modules/auth/dtos/auth.login.dto';
import { AuthResponseDto } from '~modules/auth/dtos/auth.response.dto';

export async function __e2eShouldSuccessfullyLogin(app: INestApplication): Promise<void> {
  const email = 'auth.login.success@example.com';
  const password = '.Password1';

  await UserFixture.createUser(app, email, password);

  const body: AuthLoginDto = {
    email,
    password,
  };

  const response = await request(app.getHttpServer()).post('/auth/login').send(body);

  expect(response.statusCode).toBe(HttpStatus.CREATED);

  const data = response.body as AuthResponseDto;

  expect(data.accessToken).toBeTruthy();
  expect(data.refreshToken).toBeTruthy();
}
