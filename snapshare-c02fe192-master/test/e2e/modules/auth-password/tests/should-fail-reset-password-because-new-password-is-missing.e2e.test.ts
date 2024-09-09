import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { testGenerateRandomForgotPasswordCode } from 'test~utils/generate-random-forgot-password-code.test.util';

import { AuthPasswordResetDto } from '~modules/auth-password/dtos/auth-password.reset.dto';

export async function __e2eShouldFailResetPasswordBecauseNewPasswordIsMissing(app: INestApplication): Promise<void> {
  const code = testGenerateRandomForgotPasswordCode();

  const body: Partial<AuthPasswordResetDto> = {
    code,
  };

  const response = await request(app.getHttpServer()).post('/auth-password/reset').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
