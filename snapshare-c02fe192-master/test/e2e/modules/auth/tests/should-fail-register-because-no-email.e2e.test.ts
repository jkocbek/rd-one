import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthRegisterDto } from '~modules/auth/dtos/auth.register.dto';

export async function __e2eShouldFailRegisterBecauseNoEmail(app: INestApplication): Promise<void> {
  const password = '.Password1';

  const body: Partial<AuthRegisterDto> = {
    password,
  };

  const response = await request(app.getHttpServer()).post('/auth/register').send(body);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
