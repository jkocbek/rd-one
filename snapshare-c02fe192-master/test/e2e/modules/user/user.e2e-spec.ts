import { INestApplication } from '@nestjs/common';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldFailGetUserByIdBecauseIdInvalidFormat } from './tests/should-fail-get-user-by-id-because-id-invalid-format.e2e.test';
import { __e2eShouldFailGetUserByIdBecauseUserNotFound } from './tests/should-fail-get-user-by-id-because-user-not-found.e2e.test';
import { __e2eShouldSuccessfullyGetUserById } from './tests/should-successfully-get-user-by-id.e2e.test';
import { __e2eShouldSuccessfullyListUsersOrderedByCreatedAtAscending } from './tests/should-successfully-list-users-ordered-by-created-at-ascending.e2e.test';
import { __e2eShouldSuccessfullyListUsersOrderedByCreatedAtDescending } from './tests/should-successfully-list-users-ordered-by-created-at-descending.e2e.test';
import { __e2eShouldSuccessfullyListUsersUsingFilterIds } from './tests/should-successfully-list-users-using-filter-ids.e2e.test';
import { __e2eShouldSuccessfullyListUsersUsingFilterSearch } from './tests/should-successfully-list-users-using-filter-search.e2e.test';
import { __e2eShouldSuccessfullyListUsersWhenAuthenticated } from './tests/should-successfully-list-users-when-authenticated.e2e.test';
import { __e2eShouldSuccessfullyListUsers } from './tests/should-successfully-list-users.e2e.test';

describe('user', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  describe('GET /user', () => {
    it('Should successfully list users', async () => {
      await __e2eShouldSuccessfullyListUsers(app);
    });

    it('Should successfully list users when authenticated', async () => {
      await __e2eShouldSuccessfullyListUsersWhenAuthenticated(app);
    });

    it('Should successfully list users using filter ids', async () => {
      await __e2eShouldSuccessfullyListUsersUsingFilterIds(app);
    });

    it('Should successfully list users using filter search', async () => {
      await __e2eShouldSuccessfullyListUsersUsingFilterSearch(app);
    });

    it('Should successfully list users ordered by createdAt descending', async () => {
      await __e2eShouldSuccessfullyListUsersOrderedByCreatedAtDescending(app);
    });

    it('Should successfully list users ordered by createdAt ascending', async () => {
      await __e2eShouldSuccessfullyListUsersOrderedByCreatedAtAscending(app);
    });
  });

  describe('GET /user/:id', () => {
    it('Should successfully get user by id', async () => {
      await __e2eShouldSuccessfullyGetUserById(app);
    });

    it('Should fail get user by id because id invalid format', async () => {
      await __e2eShouldFailGetUserByIdBecauseIdInvalidFormat(app);
    });

    it('Should fail get user by id because user not found', async () => {
      await __e2eShouldFailGetUserByIdBecauseUserNotFound(app);
    });
  });
});
