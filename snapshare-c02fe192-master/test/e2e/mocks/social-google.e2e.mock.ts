import { createMock } from '@golevelup/ts-jest';
import { INestApplication } from '@nestjs/common';
import { ITestNestSetupProviderOverride } from 'test~interfaces/nest-setup.test.provider-override.interface';
import { socialProviderGooglePublicCredentialsStub } from 'test~stubs/social-provider-google.stub';

import { AuthManagedSocialProviderGoogleService } from '~vendors/auth-managed-social-provider-google/auth-managed-social-provider-google.service';

export const e2eMockSocialGoogle: ITestNestSetupProviderOverride[] = [
  {
    typeOrToken: AuthManagedSocialProviderGoogleService,
    value: createMock<AuthManagedSocialProviderGoogleService>({
      getAuthenticationCredentials: jest.fn().mockReturnValue(socialProviderGooglePublicCredentialsStub),
    }),
  },
];

export function e2eMockSocialGoogleClear(app: INestApplication): void {
  const authManagedSocialProviderGoogleService = app.get(AuthManagedSocialProviderGoogleService);
  jest.spyOn(authManagedSocialProviderGoogleService, 'getAuthenticationCredentials').mockClear();
  jest.spyOn(authManagedSocialProviderGoogleService, 'getAccessTokenUsingCode').mockClear();
  jest.spyOn(authManagedSocialProviderGoogleService, 'getUserEmail').mockClear();
}

export function e2eMockSocialGoogleSpyOnGetAuthenticationCredentials(app: INestApplication) {
  const authManagedSocialProviderGoogleService = app.get(AuthManagedSocialProviderGoogleService);
  return jest.spyOn(authManagedSocialProviderGoogleService, 'getAuthenticationCredentials');
}

export function e2eMockSocialGoogleSpyOnGetUserEmail(app: INestApplication) {
  const authManagedSocialProviderGoogleService = app.get(AuthManagedSocialProviderGoogleService);
  return jest.spyOn(authManagedSocialProviderGoogleService, 'getUserEmail');
}
