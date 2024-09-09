import { INestApplication } from '@nestjs/common';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldFailGetMyUserInfoBecauseNotAuthorized } from './tests/should-fail-get-my-user-info-because-not-authorized.e2e.test';
import { __e2eShouldSuccessfullyGetMeAsUser } from './tests/should-successfully-get-me-as-user.e2e.test';

describe('user-me', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  describe('GET /user-me', () => {
    it('Should successfully get me as user', async () => {
      await __e2eShouldSuccessfullyGetMeAsUser(app);
    });

    it('Should fail get my user info because not authorized', async () => {
      await __e2eShouldFailGetMyUserInfoBecauseNotAuthorized(app);
    });
  });
});
