import { INestApplication } from '@nestjs/common';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldFailLoginBecauseEmailDoesNotExist } from './tests/should-fail-login-because-email-does-not-exist.e2e.test';
import { __e2eShouldFailLoginBecauseInvalidPassword } from './tests/should-fail-login-because-invalid-password.e2e.test';
import { __e2eShouldFailLoginBecauseMissingEmail } from './tests/should-fail-login-because-missing-email.e2e.test';
import { __e2eShouldFailLoginBecauseMissingPassword } from './tests/should-fail-login-because-missing-password.e2e.test';
import { __e2eShouldFailRefreshBecauseExpiredRefreshToken } from './tests/should-fail-refresh-because-expired-refresh-token.e2e.test';
import { __e2eShouldFailRefreshBecauseMissingAccessToken } from './tests/should-fail-refresh-because-missing-access-token.e2e.test';
import { __e2eShouldFailRefreshBecauseMissingRefreshToken } from './tests/should-fail-refresh-because-missing-refresh-token.e2e.test';
import { __e2eShouldFailRegisterBecauseEmailAlreadyTaken } from './tests/should-fail-register-because-email-already-taken.e2e.test';
import { __e2eShouldFailRegisterBecauseInvalidEmail } from './tests/should-fail-register-because-invalid-email.e2e.test';
import { __e2eShouldFailRegisterBecauseNoEmail } from './tests/should-fail-register-because-no-email.e2e.test';
import { __e2eShouldFailRegisterBecauseNoPassword } from './tests/should-fail-register-because-no-password.e2e.test';
import { __e2eShouldFailRegisterBecausePasswordEmptyString } from './tests/should-fail-register-because-password-empty-string.e2e.test';
import { __e2eShouldSuccessfullyLogin } from './tests/should-successfully-login.e2e.test';
import { __e2eShouldSuccessfullyRefreshExpiredAccessToken } from './tests/should-successfully-refresh-expired-access-token.e2e.test';
import { __e2eShouldSuccessfullyRefreshExpiredUserSession } from './tests/should-successfully-refresh-expired-user-session.e2e.test';
import { __e2eShouldSuccessfullyRefreshValidTokens } from './tests/should-successfully-refresh-valid-tokens.e2e.test';
import { __e2eShouldSuccessfullyRegister } from './tests/should-successfully-register.e2e.test';

describe('auth', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp();
  });

  describe('POST /auth/login', () => {
    it('Should successfully login', async () => {
      await __e2eShouldSuccessfullyLogin(app);
    });

    it('Should fail login because invalid password', async () => {
      await __e2eShouldFailLoginBecauseInvalidPassword(app);
    });

    it('Should fail login because email does not exist', async () => {
      await __e2eShouldFailLoginBecauseEmailDoesNotExist(app);
    });

    it('Should fail login because missing email', async () => {
      await __e2eShouldFailLoginBecauseMissingEmail(app);
    });

    it('Should fail login because missing password', async () => {
      await __e2eShouldFailLoginBecauseMissingPassword(app);
    });
  });

  describe('POST /auth/refresh', () => {
    it('Should successfully refresh valid tokens', async () => {
      await __e2eShouldSuccessfullyRefreshValidTokens(app);
    });

    it('Should successfully refresh expired access token', async () => {
      await __e2eShouldSuccessfullyRefreshExpiredAccessToken(app);
    });

    it('Should successfully refresh expired user session', async () => {
      await __e2eShouldSuccessfullyRefreshExpiredUserSession(app);
    });

    it('Should fail refresh because missing access token', async () => {
      await __e2eShouldFailRefreshBecauseMissingAccessToken(app);
    });

    it('Should fail refresh because missing refresh token', async () => {
      await __e2eShouldFailRefreshBecauseMissingRefreshToken(app);
    });

    it('Should fail refresh because expired refresh token', async () => {
      await __e2eShouldFailRefreshBecauseExpiredRefreshToken(app);
    });
  });

  describe('POST /auth/register', () => {
    it('Should successfully register', async () => {
      await __e2eShouldSuccessfullyRegister(app);
    });

    it('Should fail register because invalid email', async () => {
      await __e2eShouldFailRegisterBecauseInvalidEmail(app);
    });

    it('Should fail register because password empty string', async () => {
      await __e2eShouldFailRegisterBecausePasswordEmptyString(app);
    });

    it('Should fail register because no email', async () => {
      await __e2eShouldFailRegisterBecauseNoEmail(app);
    });

    it('Should fail register because no password', async () => {
      await __e2eShouldFailRegisterBecauseNoPassword(app);
    });

    it('Should fail register because email already taken', async () => {
      await __e2eShouldFailRegisterBecauseEmailAlreadyTaken(app);
    });
  });
});
