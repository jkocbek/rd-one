import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';
import { IBasePaginationQueryTest } from 'test~interfaces/base-pagination.query.test.interface';

import { PaginatedListDto } from '~common/dtos/paginated-list.dto';

import { UserDto } from '~modules/user/dtos/user.dto';
import { UserFilter } from '~modules/user/filters/user.filter';

export async function __e2eShouldSuccessfullyListUsersUsingFilterSearch(app: INestApplication): Promise<void> {
  const email1 = 'user.list.success.filter.search+user1@example.com';
  const email2 = 'user.list.success.filter.search+user2@example.com';
  const email3 = 'user.list.success.filter.search+user3@example.com';
  const password = '.Password1';

  const user1 = await UserFixture.createUser(app, email1, password);
  const user2 = await UserFixture.createUser(app, email2, password);
  const user3 = await UserFixture.createUser(app, email3, password);

  const query: IBasePaginationQueryTest & UserFilter = {
    search: 'user.list.success.filter.search',
    order: '-createdAt',
    limit: 10,
    page: 1,
  };

  const response = await request(app.getHttpServer()).get('/user').query(query);

  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.body as PaginatedListDto<UserDto, UserFilter>;

  expect(responseBody.page).toStrictEqual(1);
  expect(responseBody.totalItems).toStrictEqual(3);
  expect(responseBody.items[0].id).toStrictEqual(user3.id);
  expect(responseBody.items[1].id).toStrictEqual(user2.id);
  expect(responseBody.items[2].id).toStrictEqual(user1.id);
}
