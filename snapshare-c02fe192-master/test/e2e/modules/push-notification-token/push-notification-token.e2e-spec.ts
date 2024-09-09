import { INestApplication } from '@nestjs/common';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldFailCreatePushNotificationTokenBecauseTokenUseMissing } from './tests/should-fail-create-push-notification-token-because-token-use-missing.e2e.test';
import { __e2eShouldFailCreatePushNotificationTokenBecauseUserNotAuthenticated } from './tests/should-fail-create-push-notification-token-because-user-not-authenticated.e2e.test';
import { __e2eShouldSuccessfullyCreatePushNotificationToken } from './tests/should-successfully-create-push-notification-token.e2e.test';

describe('push-notification-token', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  describe('POST /push-notification-token', () => {
    it('Should successfully create push notification token', async () => {
      await __e2eShouldSuccessfullyCreatePushNotificationToken(app);
    });

    it('Should fail create push notification token because user not authenticated', async () => {
      await __e2eShouldFailCreatePushNotificationTokenBecauseUserNotAuthenticated(app);
    });

    it('Should fail create push notification token because token use missing', async () => {
      await __e2eShouldFailCreatePushNotificationTokenBecauseTokenUseMissing(app);
    });
  });
});
