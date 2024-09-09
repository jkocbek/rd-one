import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { e2eMockSocialFacebookSpyOnGetUserEmail } from 'test~e2e/mocks/social-facebook.e2e.mock';
import { RefreshTokenFixture } from 'test~fixtures/refresh-token.fixture';
import { UserIdentityProviderFixture } from 'test~fixtures/user-identity-provider.fixture';
import { UserSessionFixture } from 'test~fixtures/user-session.fixture';
import { UserFixture } from 'test~fixtures/user.fixture';

import { AuthSocialFacebookCallbackQuery } from '~modules/auth-social-facebook/queries/auth-social-facebook.callback.query';
import { UserIdentityProviderIntegration } from '~modules/user-identity-provider/enums/user-identity-provider.integration.enum';
import { makeUUID } from '~utils/uuid';

export async function __e2eShouldSuccessfullyPassThroughExistingUserOnFacebookCallback(
  app: INestApplication,
): Promise<void> {
  const sub = makeUUID();
  const email = 'auth-social-facebook.callback.success.passThroughExistingUser@example.com';
  const emailVerified = true;

  const user = await UserFixture.createUserWithoutProvider(app, email);
  await UserIdentityProviderFixture.createForUser(app, user.id, sub, UserIdentityProviderIntegration.FACEBOOK);

  const spyGetAuthenticationCredentials = e2eMockSocialFacebookSpyOnGetUserEmail(app).mockImplementationOnce(
    async () => {
      return { sub, email, emailVerified };
    },
  );

  const query: AuthSocialFacebookCallbackQuery = {
    code: 'test-code',
    redirectUri: 'http://example.com',
  };

  const response = await request(app.getHttpServer()).get('/auth-social-facebook/callback').query(query);

  expect(response.statusCode).toBe(HttpStatus.OK);
  expect(spyGetAuthenticationCredentials).toHaveBeenCalledTimes(1);
  expect(spyGetAuthenticationCredentials).toHaveReturnedTimes(1);

  const provider = await UserIdentityProviderFixture.findForUser(
    app,
    user.id,
    UserIdentityProviderIntegration.FACEBOOK,
  );

  expect(provider.emailVerified).toStrictEqual(emailVerified);
  expect(provider.sub).toStrictEqual(sub);

  const userSessions = await UserSessionFixture.findManyByUserId(app, user.id);
  const refreshTokens = await RefreshTokenFixture.findManyByUserId(app, user.id);

  expect(userSessions.length).toStrictEqual(1);
  expect(refreshTokens.length).toStrictEqual(1);
}
