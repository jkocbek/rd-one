import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthRegisterDto } from '~modules/auth/dtos/auth.register.dto';

export async function __e2eShouldFailRegisterBecauseInvalidEmail(app: INestApplication): Promise<void> {
  const email = 'auth.register.error.badRequest.invalidEmail';
  const password = '.Password1';

  const body: AuthRegisterDto = {
    email,
    password,
  };

  const response = await request(app.getHttpServer()).post('/auth/register').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
