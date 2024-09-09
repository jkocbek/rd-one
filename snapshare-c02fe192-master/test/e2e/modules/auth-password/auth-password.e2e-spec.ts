import { INestApplication } from '@nestjs/common';
import { e2eMockEmailClear, e2eMockEmail } from 'test~e2e/mocks/email.e2e.mock';
import { createTestingApp } from 'test~helpers';

import { __e2eShouldFailResetPasswordBecauseCodeIsMissing } from './tests/should-fail-reset-password-because-code-is-missing.e2e.test';
import { __e2eShouldFailResetPasswordBecauseForgotPasswordCodeExpired } from './tests/should-fail-reset-password-because-forgot-password-code-expired.e2e.test';
import { __e2eShouldFailResetPasswordBecauseForgotPasswordCodeWasNotFound } from './tests/should-fail-reset-password-because-forgot-password-code-was-not-found.e2e.test';
import { __e2eShouldFailResetPasswordBecauseNewPasswordIsMissing } from './tests/should-fail-reset-password-because-new-password-is-missing.e2e.test';
import { __e2eShouldSuccessfullyForgetPasswordButFailSendingEmail } from './tests/should-successfully-forget-password-but-fail-sending-email.e2e.test';
import { __e2eShouldSuccessfullyForgetPassword } from './tests/should-successfully-forget-password.e2e.test';
import { __e2eShouldSuccessfullyResetPassword } from './tests/should-successfully-reset-password.e2e.test';
import { __e2eShouldSuccessfullySkipForgetPasswordBecauseEmailDoesntExist } from './tests/should-successfully-skip-forget-password-because-email-doesnt-exist.e2e.test';

describe('auth-password', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestingApp([...e2eMockEmail]);
  });

  afterEach(async () => {
    e2eMockEmailClear(app);
  });

  describe('POST /auth-password/forgot', () => {
    it('Should successfully forget password', async () => {
      await __e2eShouldSuccessfullyForgetPassword(app);
    });

    it('Should successfully skip forget password because email doesnt exist', async () => {
      await __e2eShouldSuccessfullySkipForgetPasswordBecauseEmailDoesntExist(app);
    });

    it('Should successfully forget password but fail sending email', async () => {
      await __e2eShouldSuccessfullyForgetPasswordButFailSendingEmail(app);
    });
  });

  describe('POST /auth-password/reset', () => {
    it('Should successfully reset password', async () => {
      await __e2eShouldSuccessfullyResetPassword(app);
    });

    it('Should fail reset password because code is missing', async () => {
      await __e2eShouldFailResetPasswordBecauseCodeIsMissing(app);
    });

    it('Should fail reset password because new password is missing', async () => {
      await __e2eShouldFailResetPasswordBecauseNewPasswordIsMissing(app);
    });

    it('Should fail reset password because forgot password code was not found (flow not started)', async () => {
      await __e2eShouldFailResetPasswordBecauseForgotPasswordCodeWasNotFound(app);
    });

    it('Should fail reset password because forgot password code expired', async () => {
      await __e2eShouldFailResetPasswordBecauseForgotPasswordCodeExpired(app);
    });
  });
});
