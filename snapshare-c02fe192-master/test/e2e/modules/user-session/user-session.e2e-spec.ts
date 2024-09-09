import { INestApplication } from '@nestjs/common';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldFailGetUserSessionByIdBecauseIdInvalidFormat } from './tests/should-fail-get-user-session-by-id-because-id-invalid-format.e2e.test';
import { __e2eShouldFailGetUserSessionByIdBecauseSessionBelongsToAnotherUser } from './tests/should-fail-get-user-session-by-id-because-session-belongs-to-another-user.e2e.test';
import { __e2eShouldFailGetUserSessionByIdBecauseSessionNotFound } from './tests/should-fail-get-user-session-by-id-because-session-not-found.e2e.test';
import { __e2eShouldFailGetUserSessionByIdBecauseUnathorized } from './tests/should-fail-get-user-session-by-id-because-unathorized.e2e.test';
import { __e2eShouldFailListUserSessionsBecauseNotAuthenticated } from './tests/should-fail-list-user-sessions-because-not-authenticated.e2e.test';
import { __e2eShouldSuccessfullyGetUserSessionById } from './tests/should-successfully-get-user-session-by-id.e2e.test';
import { __e2eShouldSuccessfullyListUserSessionsOfAuthenticatedUserOnly } from './tests/should-successfully-list-user-sessions-of-authenticated-user-only.e2e.test';
import { __e2eShouldSuccessfullyListUserSessionsUsingFilterIds } from './tests/should-successfully-list-user-sessions-using-filter-ids.e2e.test';
import { __e2eShouldSuccessfullyListUserSessions } from './tests/should-successfully-list-user-sessions.e2e.test';

describe('user-session', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  describe('GET /user-session', () => {
    it('Should successfully list user sessions', async () => {
      await __e2eShouldSuccessfullyListUserSessions(app);
    });

    it('Should successfully list user sessions using filter ids', async () => {
      await __e2eShouldSuccessfullyListUserSessionsUsingFilterIds(app);
    });

    it('Should successfully list user sessions of authenticated user only', async () => {
      await __e2eShouldSuccessfullyListUserSessionsOfAuthenticatedUserOnly(app);
    });

    it('Should fail list user sessions because not authenticated', async () => {
      await __e2eShouldFailListUserSessionsBecauseNotAuthenticated(app);
    });
  });

  describe('GET /user-session/:id', () => {
    it('Should successfully get user session by id', async () => {
      await __e2eShouldSuccessfullyGetUserSessionById(app);
    });

    it('Should fail get user session by id because id invalid format', async () => {
      await __e2eShouldFailGetUserSessionByIdBecauseIdInvalidFormat(app);
    });

    it('Should fail get user session by id because session not found', async () => {
      await __e2eShouldFailGetUserSessionByIdBecauseSessionNotFound(app);
    });

    it('Should fail get user session by id because session belongs to another user', async () => {
      await __e2eShouldFailGetUserSessionByIdBecauseSessionBelongsToAnotherUser(app);
    });

    it('Should fail get user session by id because unathorized', async () => {
      await __e2eShouldFailGetUserSessionByIdBecauseUnathorized(app);
    });
  });
});
