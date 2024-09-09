import { INestApplication } from '@nestjs/common';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldSucessfullyReturnAppStatusHealth } from './tests/should-sucessfully-return-app-status-health.e2e.test';

describe('app', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  describe('GET /api', () => {
    it('Should sucessfully return app status health', async () => {
      await __e2eShouldSucessfullyReturnAppStatusHealth(app);
    });
  });
});
