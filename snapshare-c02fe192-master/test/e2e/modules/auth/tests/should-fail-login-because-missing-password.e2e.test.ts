import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthLoginDto } from '~modules/auth/dtos/auth.login.dto';

export async function __e2eShouldFailLoginBecauseMissingPassword(app: INestApplication): Promise<void> {
  const email = 'auth.login.error.badRequest.passwordMissing@example.com';

  const body: Partial<AuthLoginDto> = {
    email,
  };

  const response = await request(app.getHttpServer()).post('/auth/login').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
