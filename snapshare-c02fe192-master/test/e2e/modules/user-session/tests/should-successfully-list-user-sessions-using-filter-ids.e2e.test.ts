import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserSessionFixture } from 'test~fixtures/user-session.fixture';
import { UserFixture } from 'test~fixtures/user.fixture';
import { IBasePaginationQueryTest } from 'test~interfaces/base-pagination.query.test.interface';

import { PaginatedListDto } from '~common/dtos/paginated-list.dto';

import { UserSessionDto } from '~modules/user-session/dtos/user-session.dto';
import { UserSessionFilter } from '~modules/user-session/filters/user-session.filter';

export async function __e2eShouldSuccessfullyListUserSessionsUsingFilterIds(app: INestApplication): Promise<void> {
  const email = 'user-session.list.success.filter.ids@example.com';

  const user = await UserFixture.createUser(app, email);
  const accessToken = await UserFixture.createUserAccessToken(app, user.id);
  await UserFixture.createUserAccessToken(app, user.id);
  await UserFixture.createUserAccessToken(app, user.id);
  await UserFixture.createUserAccessToken(app, user.id);
  await UserFixture.createUserAccessToken(app, user.id);

  const userSessions = await UserSessionFixture.findManyByUserId(app, user.id);
  const userSessionIds = userSessions.map((session) => session.id);

  const query: IBasePaginationQueryTest & UserSessionFilter = {
    ids: [userSessionIds[0], userSessionIds[1], userSessionIds[2]],
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

  const responseItemIds = responseBody.items.map((item) => item.id);

  expect(responseItemIds).toContain(userSessionIds[0]);
  expect(responseItemIds).toContain(userSessionIds[1]);
  expect(responseItemIds).toContain(userSessionIds[2]);
}
