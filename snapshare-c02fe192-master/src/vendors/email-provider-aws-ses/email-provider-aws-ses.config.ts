import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class EmailProviderAwsSesConfig {
  @Expose()
  @IsString()
  @IsOptional()
  accessKeyId?: string;

  @Expose()
  @IsString()
  @IsOptional()
  secretAccessKey?: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  region!: string;

  @Expose()
  @IsString()
  @IsOptional()
  apiEndpoint?: string;

  @Expose()
  @IsEmail()
  @IsNotEmpty()
  emailFrom!: string;
}

export interface IEmailProviderAwsSesConfig extends EmailProviderAwsSesConfig {}
