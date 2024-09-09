import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { AuthRegisterDto } from '~modules/auth/dtos/auth.register.dto';
import { AuthResponseDto } from '~modules/auth/dtos/auth.response.dto';

export async function __e2eShouldSuccessfullyRegister(app: INestApplication): Promise<void> {
  const email = 'auth.register.success@example.com';
  const password = '.Password1';

  const body: AuthRegisterDto = {
    email,
    password,
  };

  const response = await request(app.getHttpServer()).post('/auth/register').send(body);

  expect(response.statusCode).toBe(HttpStatus.CREATED);

  const data = response.body as AuthResponseDto;

  expect(data.accessToken).toBeTruthy();
  expect(data.refreshToken).toBeTruthy();
}
