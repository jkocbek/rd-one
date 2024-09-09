import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class AuthExternalProviderAuth0ClientConfig {
  @Expose()
  @IsString()
  @IsOptional()
  readonly clientId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly domain?: string;
}

export interface IAuthExternalProviderAuth0ClientConfig extends AuthExternalProviderAuth0ClientConfig {}
