import { INestApplication } from '@nestjs/common';
import { e2eMockSocialGoogle, e2eMockSocialGoogleClear } from 'test~e2e/mocks/social-google.e2e.mock';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldSuccessfullyGenerateAuthSocialGoogleUrl } from './tests/should-successfully-generate-auth-social-google-url.e2e.test';

describe('utility-auth-social-google', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp([...e2eMockSocialGoogle]);
  });

  afterEach(async () => {
    e2eMockSocialGoogleClear(app);
  });

  describe('GET /utility-auth-social-google/generate', () => {
    it('Should successfully generate auth social google url', async () => {
      await __e2eShouldSuccessfullyGenerateAuthSocialGoogleUrl(app);
    });
  });
});
