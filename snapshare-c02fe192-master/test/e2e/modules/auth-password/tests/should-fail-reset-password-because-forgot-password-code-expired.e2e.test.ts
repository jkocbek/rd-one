import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PasswordForgotFixture } from 'test~fixtures/password-forgot.fixture';
import { UserFixture } from 'test~fixtures/user.fixture';
import { testGenerateRandomForgotPasswordCode } from 'test~utils/generate-random-forgot-password-code.test.util';

import { AuthPasswordResetDto } from '~modules/auth-password/dtos/auth-password.reset.dto';

export async function __e2eShouldFailResetPasswordBecauseForgotPasswordCodeExpired(
  app: INestApplication,
): Promise<void> {
  const email = 'auth-password.reset.fail.forgotPasswordCodeExpired@example.com';
  const code = testGenerateRandomForgotPasswordCode();

  const user = await UserFixture.createUser(app, email);
  await PasswordForgotFixture.createExpiredCode(app, user.id, code);

  const body: AuthPasswordResetDto = {
    code,
    newPassword: '.Password1',
  };

  const response = await request(app.getHttpServer()).post('/auth-password/reset').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
