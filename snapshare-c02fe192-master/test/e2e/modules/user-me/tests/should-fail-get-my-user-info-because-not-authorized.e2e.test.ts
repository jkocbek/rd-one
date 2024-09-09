import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function __e2eShouldFailGetMyUserInfoBecauseNotAuthorized(app: INestApplication): Promise<void> {
  const response = await request(app.getHttpServer()).get('/user-me');

  expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
}
