import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthPasswordResetDto } from '~modules/auth-password/dtos/auth-password.reset.dto';

export async function __e2eShouldFailResetPasswordBecauseCodeIsMissing(app: INestApplication): Promise<void> {
  const body: Partial<AuthPasswordResetDto> = {
    newPassword: '.Password1',
  };

  const response = await request(app.getHttpServer()).post('/auth-password/reset').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
