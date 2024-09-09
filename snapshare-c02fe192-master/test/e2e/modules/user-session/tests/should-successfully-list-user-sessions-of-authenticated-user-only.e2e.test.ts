import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { UserSessionFixture } from 'test~fixtures/user-session.fixture';
import { UserFixture } from 'test~fixtures/user.fixture';
import { IBasePaginationQueryTest } from 'test~interfaces/base-pagination.query.test.interface';

import { PaginatedListDto } from '~common/dtos/paginated-list.dto';

import { UserSessionDto } from '~modules/user-session/dtos/user-session.dto';
import { UserSessionFilter } from '~modules/user-session/filters/user-session.filter';

export async function __e2eShouldSuccessfullyListUserSessionsOfAuthenticatedUserOnly(
  app: INestApplication,
): Promise<void> {
  const email1 = 'user-session.list.success.ofAuthenticatedUserOnly+user1@example.com';
  const email2 = 'user-session.list.success.ofAuthenticatedUserOnly+user2@example.com';

  const user1 = await UserFixture.createUser(app, email1);
  const user2 = await UserFixture.createUser(app, email2);

  const accessToken = await UserFixture.createUserAccessToken(app, user1.id);
  await UserFixture.createUserAccessToken(app, user1.id);
  await UserFixture.createUserAccessToken(app, user1.id);

  await UserFixture.createUserAccessToken(app, user2.id);
  await UserFixture.createUserAccessToken(app, user2.id);

  const user1Sessions = await UserSessionFixture.findManyByUserId(app, user1.id);
  const user1SessionIds = user1Sessions.map((session) => session.id);

  const user2Sessions = await UserSessionFixture.findManyByUserId(app, user2.id);
  const user2SessionIds = user2Sessions.map((session) => session.id);

  const query: IBasePaginationQueryTest & UserSessionFilter = {
    ids: [user1SessionIds[0], user1SessionIds[1], user1SessionIds[2], user2SessionIds[0], user2SessionIds[1]],
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

  expect(responseItemIds).toContain(user1SessionIds[0]);
  expect(responseItemIds).toContain(user1SessionIds[1]);
  expect(responseItemIds).toContain(user1SessionIds[2]);
}
