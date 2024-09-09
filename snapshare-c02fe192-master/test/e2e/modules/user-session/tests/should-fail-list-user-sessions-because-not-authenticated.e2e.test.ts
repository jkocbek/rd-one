import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function __e2eShouldFailListUserSessionsBecauseNotAuthenticated(app: INestApplication): Promise<void> {
  const response = await request(app.getHttpServer()).get('/user-session');

  expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
}
