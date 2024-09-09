import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';

import { PaginatedListDto } from '~common/dtos/paginated-list.dto';

import { UserDto } from '~modules/user/dtos/user.dto';
import { UserFilter } from '~modules/user/filters/user.filter';

export async function __e2eShouldSuccessfullyListUsers(app: INestApplication): Promise<void> {
  const email1 = 'user.list.success+user1@example.com';
  const email2 = 'user.list.success+user2@example.com';
  const email3 = 'user.list.success+user3@example.com';
  const password = '.Password1';

  await UserFixture.createUser(app, email1, password);
  await UserFixture.createUser(app, email2, password);
  await UserFixture.createUser(app, email3, password);

  const response = await request(app.getHttpServer()).get('/user');

  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.body as PaginatedListDto<UserDto, UserFilter>;

  expect(responseBody.page).toStrictEqual(1);
  expect(responseBody.totalItems).toBeGreaterThanOrEqual(3);
}
