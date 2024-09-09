import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthLoginDto } from '~modules/auth/dtos/auth.login.dto';

export async function __e2eShouldFailLoginBecauseMissingEmail(app: INestApplication): Promise<void> {
  const password = '.Password1';

  const body: Partial<AuthLoginDto> = {
    password,
  };

  const response = await request(app.getHttpServer()).post('/auth/login').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
