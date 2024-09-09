import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

export async function __e2eShouldFailGetUserByIdBecauseIdInvalidFormat(app: INestApplication): Promise<void> {
  const invalidFormatId = 'invalidId-format';

  const response = await request(app.getHttpServer()).get(`/user/${invalidFormatId}`);

  expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
