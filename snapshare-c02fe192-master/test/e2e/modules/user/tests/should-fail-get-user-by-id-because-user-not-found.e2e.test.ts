import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';

import { makeUUID } from '~utils/uuid';

export async function __e2eShouldFailGetUserByIdBecauseUserNotFound(app: INestApplication): Promise<void> {
  const unknownId = makeUUID();

  const response = await request(app.getHttpServer()).get(`/user/${unknownId}`);

  expect(response.statusCode).toBe(HttpStatus.NOT_FOUND);
}
