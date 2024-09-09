import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class OpenidClientAuth0Config {
  @Expose()
  @IsString()
  @IsOptional()
  readonly domain?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly clientId?: string;
}

export interface IOpenidClientAuth0Config extends OpenidClientAuth0Config {}
