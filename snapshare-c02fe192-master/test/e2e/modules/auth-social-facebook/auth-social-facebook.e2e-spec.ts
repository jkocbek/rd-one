import { INestApplication } from '@nestjs/common';
import { e2eMockSocialFacebookClear, e2eMockSocialFacebook } from 'test~e2e/mocks/social-facebook.e2e.mock';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldSuccessfullyAddFacebookProviderToExistingUserOnFacebookCallback } from './tests/should-successfully-add-facebook-provider-to-existing-user-on-facebook-callback.e2e.test';
import { __e2eShouldSuccessfullyCreateProviderOnlyOnFacebookCallback } from './tests/should-successfully-create-provider-only-on-facebook-callback.e2e.test';
import { __e2eShouldSuccessfullyCreateUserAndProviderOnFacebookCallback } from './tests/should-successfully-create-user-and-provider-on-facebook-callback.e2e.test';
import { __e2eShouldSuccessfullyGetSocialFacebookCredentials } from './tests/should-successfully-get-social-facebook-credentials.e2e.test';
import { __e2eShouldSuccessfullyPassThroughExistingUserOnFacebookCallback } from './tests/should-successfully-pass-through-existing-user-on-facebook-callback.e2e.test';

describe('auth-social-facebook', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp([...e2eMockSocialFacebook]);
  });

  afterEach(async () => {
    e2eMockSocialFacebookClear(app);
  });

  describe('GET /auth-social-facebook/credentials', () => {
    it('Should successfully get social facebook credentials', async () => {
      await __e2eShouldSuccessfullyGetSocialFacebookCredentials(app);
    });
  });

  describe('GET /auth-social-facebook/callback', () => {
    it('Should successfully create user and provider on facebook callback', async () => {
      await __e2eShouldSuccessfullyCreateUserAndProviderOnFacebookCallback(app);
    });

    it('Should successfully create provider only on facebook callback', async () => {
      await __e2eShouldSuccessfullyCreateProviderOnlyOnFacebookCallback(app);
    });

    it('Should successfully add facebook provider to existing user on facebook callback', async () => {
      await __e2eShouldSuccessfullyAddFacebookProviderToExistingUserOnFacebookCallback(app);
    });

    it('Should successfully pass through existing user on facebook callback', async () => {
      await __e2eShouldSuccessfullyPassThroughExistingUserOnFacebookCallback(app);
    });
  });
});
