import { INestApplication } from '@nestjs/common';
import { e2eMockSocialFacebook, e2eMockSocialFacebookClear } from 'test~e2e/mocks/social-facebook.e2e.mock';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldSuccessfullyGenerateAuthSocialFacebookUrl } from './tests/should-successfully-generate-auth-social-facebook-url.e2e.test';

describe('utility-auth-social-facebook', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp([...e2eMockSocialFacebook]);
  });

  afterEach(async () => {
    e2eMockSocialFacebookClear(app);
  });

  describe('GET /utility-auth-social-facebook/generate', () => {
    it('Should successfully generate auth social facebook url', async () => {
      await __e2eShouldSuccessfullyGenerateAuthSocialFacebookUrl(app);
    });
  });
});
