import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class OpenidClientAwsCognitoConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly region!: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly userPoolId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  readonly clientId?: string;
}

export interface IOpenidClientAwsCognitoConfig extends OpenidClientAwsCognitoConfig {}
