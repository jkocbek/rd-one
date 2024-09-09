jest.mock('~modules/media/enums/media.use.enum', () => ({
  MediaUse: {
    EXAMPLE: 'EXAMPLE',
  },
}));
jest.mock('~modules/media/media.constants', () => ({
  mediaUseConstraints: {
    EXAMPLE: { maxContentLength: 10 * 1024 * 1024, allowedMimeTypes: ['image/*'] },
  },
}));

import { INestApplication } from '@nestjs/common';
import { e2eMockMedia, e2eMockMediaClear } from 'test~e2e/mocks/media.e2e.mock';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldFailCreatePresignedUrlBecauseMediaUseMissing } from './tests/should-fail-create-presigned-url-because-media-use-missing.e2e.test';
import { __e2eShouldFailCreatePresignedUrlBecauseMediaUseNotValid } from './tests/should-fail-create-presigned-url-because-media-use-not-valid.e2e.test';
import { __e2eShouldFailCreatePresignedUrlBecauseUserNotAuthenticated } from './tests/should-fail-create-presigned-url-because-user-not-authenticated.e2e.test';
import { __e2eShouldSuccessfullyCreatePresignedUrl } from './tests/should-successfully-create-presigned-url.e2e.test';

describe('media-presigned-url', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp([...e2eMockMedia]);
  });

  afterEach(async () => {
    e2eMockMediaClear(app);
  });

  describe('POST /media-presigned-url', () => {
    it('Should successfully create presigned url', async () => {
      await __e2eShouldSuccessfullyCreatePresignedUrl(app);
    });

    it('Should fail create presigned url because user not authenticated', async () => {
      await __e2eShouldFailCreatePresignedUrlBecauseUserNotAuthenticated(app);
    });

    it('Should fail create presigned url because media use not valid', async () => {
      await __e2eShouldFailCreatePresignedUrlBecauseMediaUseNotValid(app);
    });

    it('Should fail create presigned url because media use missing', async () => {
      await __e2eShouldFailCreatePresignedUrlBecauseMediaUseMissing(app);
    });
  });
});
