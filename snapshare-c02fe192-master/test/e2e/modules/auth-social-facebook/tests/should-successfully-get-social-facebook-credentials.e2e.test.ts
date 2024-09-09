import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { e2eMockSocialFacebookSpyOnGetAuthenticationCredentials } from 'test~e2e/mocks/social-facebook.e2e.mock';
import { socialProviderFacebookPublicCredentialsStub } from 'test~stubs/social-provider-facebook.stub';

import { AuthSocialFacebookCredentialsDto } from '~modules/auth-social-facebook/dtos/auth-social-facebook.credentials.dto';

export async function __e2eShouldSuccessfullyGetSocialFacebookCredentials(app: INestApplication): Promise<void> {
  const spyGetAuthenticationCredentials = e2eMockSocialFacebookSpyOnGetAuthenticationCredentials(app);

  const response = await request(app.getHttpServer()).get('/auth-social-facebook/credentials');

  expect(response.statusCode).toBe(HttpStatus.OK);
  expect(spyGetAuthenticationCredentials).toHaveBeenCalledTimes(1);
  expect(spyGetAuthenticationCredentials).toHaveReturnedTimes(1);

  const facebookCredentials = response.body as AuthSocialFacebookCredentialsDto;

  expect(facebookCredentials.baseUrl).toStrictEqual(socialProviderFacebookPublicCredentialsStub.baseUrl);
  expect(facebookCredentials.clientId).toStrictEqual(socialProviderFacebookPublicCredentialsStub.clientId);
  expect(facebookCredentials.responseType).toStrictEqual(socialProviderFacebookPublicCredentialsStub.responseType);
  expect(facebookCredentials.scopes).toStrictEqual(socialProviderFacebookPublicCredentialsStub.scopes);
}
