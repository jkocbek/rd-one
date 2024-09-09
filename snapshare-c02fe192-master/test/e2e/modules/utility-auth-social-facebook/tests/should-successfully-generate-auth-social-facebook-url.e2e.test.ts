import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { e2eMockSocialFacebookSpyOnGetAuthenticationCredentials } from 'test~e2e/mocks/social-facebook.e2e.mock';
import { socialProviderFacebookPublicCredentialsStub } from 'test~stubs/social-provider-facebook.stub';

export async function __e2eShouldSuccessfullyGenerateAuthSocialFacebookUrl(app: INestApplication): Promise<void> {
  const spyGetAuthenticationCredentials = e2eMockSocialFacebookSpyOnGetAuthenticationCredentials(app);

  const response = await request(app.getHttpServer()).get(`/utility-auth-social-facebook/generate`);
  expect(response.statusCode).toBe(HttpStatus.OK);

  const responseBody = response.text as string;

  expect(spyGetAuthenticationCredentials).toHaveBeenCalledTimes(1);
  expect(spyGetAuthenticationCredentials).toHaveReturnedTimes(1);
  expect(responseBody).toBeTruthy();

  const hasClient = responseBody.includes(socialProviderFacebookPublicCredentialsStub.clientId as string);
  const hasResponseType = responseBody.includes(socialProviderFacebookPublicCredentialsStub.responseType as string);

  expect(hasClient).toStrictEqual(true);
  expect(hasResponseType).toStrictEqual(true);
}
