import { IAuthManagedSocialProviderPublicCredentials } from './interfaces/auth-managed-social-provider.base.public-credentials.interface';
import { IAuthManagedSocialProviderUserEmail } from './interfaces/auth-managed-social-provider.user-email.interface';

export abstract class AuthManagedSocialProviderService {
  abstract getAuthenticationCredentials(): Promise<IAuthManagedSocialProviderPublicCredentials>;
  abstract getAccessTokenUsingCode(code: string, redirectUri: string): Promise<string | undefined>;
  abstract getUserEmail(accessToken: string): Promise<IAuthManagedSocialProviderUserEmail>;
}
