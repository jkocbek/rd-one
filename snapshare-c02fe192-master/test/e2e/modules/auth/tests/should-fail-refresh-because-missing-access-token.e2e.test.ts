import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';

import { AuthRefreshTokenDto } from '~modules/auth/dtos/auth.refresh-token.dto';

export async function __e2eShouldFailRefreshBecauseMissingAccessToken(app: INestApplication): Promise<void> {
  const refreshToken = await UserFixture.createRandomAccessToken();

  const refreshBody: Partial<AuthRefreshTokenDto> = {
    refreshToken,
  };

  const refreshResponse = await request(app.getHttpServer()).post('/auth/refresh').send(refreshBody);

  expect(refreshResponse.statusCode).toBe(HttpStatus.BAD_REQUEST);
}
