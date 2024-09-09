import { INestApplication } from '@nestjs/common';
import { e2eMockSocialGoogle, e2eMockSocialGoogleClear } from 'test~e2e/mocks/social-google.e2e.mock';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldSuccessfullyAddGoogleProviderToExistingUserOnGoogleCallback } from './tests/should-successfully-add-google-provider-to-existing-user-on-google-callback.e2e.test';
import { __e2eShouldSuccessfullyCreateProviderOnlyOnGoogleCallback } from './tests/should-successfully-create-provider-only-on-google-callback.e2e.test';
import { __e2eShouldSuccessfullyCreateUserAndProviderOnGoogleCallback } from './tests/should-successfully-create-user-and-provider-on-google-callback.e2e.test';
import { __e2eShouldSuccessfullyGetSocialGoogleCredentials } from './tests/should-successfully-get-social-google-credentials.e2e.test';
import { __e2eShouldSuccessfullyPassThroughExistingUserOnGoogleCallback } from './tests/should-successfully-pass-through-existing-user-on-google-callback.e2e.test';

describe('auth-social-google', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp([...e2eMockSocialGoogle]);
  });

  afterEach(async () => {
    e2eMockSocialGoogleClear(app);
  });

  describe('GET /auth-social-google/credentials', () => {
    it('Should successfully get social google credentials', async () => {
      await __e2eShouldSuccessfullyGetSocialGoogleCredentials(app);
    });
  });

  describe('GET /auth-social-google/callback', () => {
    it('Should successfully create user and provider on google callback', async () => {
      await __e2eShouldSuccessfullyCreateUserAndProviderOnGoogleCallback(app);
    });

    it('Should successfully create provider only on google callback', async () => {
      await __e2eShouldSuccessfullyCreateProviderOnlyOnGoogleCallback(app);
    });

    it('Should successfully add google provider to existing user on google callback', async () => {
      await __e2eShouldSuccessfullyAddGoogleProviderToExistingUserOnGoogleCallback(app);
    });

    it('Should successfully pass through existing user on google callback', async () => {
      await __e2eShouldSuccessfullyPassThroughExistingUserOnGoogleCallback(app);
    });
  });
});
