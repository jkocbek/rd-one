import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserFixture } from 'test~fixtures/user.fixture';
import { IBasePaginationQueryTest } from 'test~interfaces/base-pagination.query.test.interface';

import { PaginatedListDto } from '~common/dtos/paginated-list.dto';

import { UserSessionDto } from '~modules/user-session/dtos/user-session.dto';
import { UserSessionFilter } from '~modules/user-session/filters/user-session.filter';

export async function __e2eShouldSuccessfullyListUserSessions(app: INestApplication): Promise<void> {
  const email = 'user-session.list.success@example.com';

  const user = await UserFixture.createUser(app, email);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);
  await UserFixture.createUserAccessToken(app, user.id);
  await UserFixture.createUserAccessToken(app, user.id);

  const query: IBasePaginationQueryTest & UserSessionFilter = {
    limit: 10,
    page: 1,
  };

  const response = await request(app.getHttpServer())
    .get('/user-session')
    .query(query)
    .auth(accessToken, { type: 'bearer' });

  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.body as PaginatedListDto<UserSessionDto, UserSessionFilter>;

  expect(responseBody.page).toStrictEqual(1);
  expect(responseBody.limit).toStrictEqual(10);
  expect(responseBody.items.length).toStrictEqual(3);
}
