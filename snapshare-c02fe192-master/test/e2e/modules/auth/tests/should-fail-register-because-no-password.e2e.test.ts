import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthRegisterDto } from '~modules/auth/dtos/auth.register.dto';

export async function __e2eShouldFailRegisterBecauseNoPassword(app: INestApplication): Promise<void> {
  const email = 'auth.register.error.badRequest.noPassword@example.com';

  const body: Partial<AuthRegisterDto> = {
    email,
  };

  const response = await request(app.getHttpServer()).post('/auth/register').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
