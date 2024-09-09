import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RefreshTokenFixture } from 'test~fixtures/refresh-token.fixture';
import { UserSessionFixture } from 'test~fixtures/user-session.fixture';
import { UserFixture } from 'test~fixtures/user.fixture';

import { AuthLoginDto } from '~modules/auth/dtos/auth.login.dto';
import { AuthRefreshTokenDto } from '~modules/auth/dtos/auth.refresh-token.dto';
import { AuthResponseDto } from '~modules/auth/dtos/auth.response.dto';

export async function __e2eShouldSuccessfullyRefreshValidTokens(app: INestApplication): Promise<void> {
  const email = 'auth.refresh.success.refreshValidTokens@example.com';
  const password = '.Password1';

  const user = await UserFixture.createUser(app, email, password);

  const loginBody: AuthLoginDto = {
    email,
    password,
  };

  const loginResponse = await request(app.getHttpServer()).post('/auth/login').send(loginBody);

  expect(loginResponse.statusCode).toBe(HttpStatus.CREATED);

  const loginData = loginResponse.body as AuthResponseDto;

  expect(loginData.accessToken).toBeTruthy();
  expect(loginData.refreshToken).toBeTruthy();

  const refreshBody: AuthRefreshTokenDto = {
    accessToken: loginData.accessToken,
    refreshToken: loginData.refreshToken,
  };

  const refreshResponse = await request(app.getHttpServer()).post('/auth/refresh').send(refreshBody);

  expect(refreshResponse.statusCode).toBe(HttpStatus.CREATED);

  const refreshData = refreshResponse.body as AuthResponseDto;

  expect(refreshData.accessToken).toBeTruthy();
  expect(refreshData.refreshToken).toBeTruthy();
  expect(refreshData.accessToken).not.toEqual(loginData.accessToken);
  expect(refreshData.refreshToken).not.toEqual(loginData.refreshToken);

  const userSessions = await UserSessionFixture.findManyByUserId(app, user.id);

  expect(userSessions.length).toStrictEqual(1);

  const refreshToken = await RefreshTokenFixture.findByToken(app, refreshData.refreshToken);

  expect(refreshToken?.token).toStrictEqual(refreshData.refreshToken);
}
