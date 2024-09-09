import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class EmailProviderSendgridConfig {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly apiKey!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly emailFrom!: string;
}

export interface IEmailProviderSendgridConfig extends EmailProviderSendgridConfig {}
