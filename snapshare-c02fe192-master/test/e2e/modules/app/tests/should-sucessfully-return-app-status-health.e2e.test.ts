import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function __e2eShouldSucessfullyReturnAppStatusHealth(app: INestApplication): Promise<void> {
  const response = await request(app.getHttpServer()).get('/');

  expect(response.statusCode).toBe(HttpStatus.OK);
}
