import { IAuthManagedCustomProviderAccessTokenPayload } from './interfaces/auth-managed-custom-provider.access-token.payload.interface';
import { IAuthManagedCustomProviderResponse } from './interfaces/auth-managed-custom-provider.response.interface';

export abstract class AuthManagedCustomProviderService {
  abstract verifyAccessToken<ResponseType>(token: string): ResponseType;
  abstract decodeAccessToken<ResponseType>(token: string): ResponseType;
  abstract verifyRefreshToken<ResponseType>(token: string): ResponseType;
  abstract encryptPassword(password: string): Promise<string>;
  abstract encryptComparePassword(password: string, encrypted: string): Promise<boolean>;
  abstract generateTokens(payload: IAuthManagedCustomProviderAccessTokenPayload): IAuthManagedCustomProviderResponse;
}
