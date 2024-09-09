import { Prisma } from '@prisma/client';
import { Expose, Type } from 'class-transformer';
import { IsString, IsOptional, IsInt, IsBoolean, ValidateIf } from 'class-validator';

import { TransformInputToBoolean } from '~vendors/class-validator';

export class PrismaConfig {
  @Expose()
  @IsOptional()
  @IsString()
  url!: string;

  @Expose()
  @ValidateIf((o) => !o.url)
  @IsString()
  name!: string;

  @Expose()
  @ValidateIf((o) => !o.url)
  @IsString()
  host!: string;

  @Expose()
  @ValidateIf((o) => !o.url)
  @IsInt()
  @Type(() => Number)
  port!: number;

  @Expose()
  @ValidateIf((o) => !o.url)
  @IsString()
  username!: string;

  @Expose()
  @ValidateIf((o) => !o.url)
  @IsString()
  password!: string;

  @Expose()
  @IsOptional()
  @IsString({ each: true })
  log?: Prisma.LogLevel[];

  @Expose()
  @IsBoolean()
  @TransformInputToBoolean()
  runMigrations: boolean = false;

  get databaseUrl(): string {
    return this.url || `postgresql://${this.username}:${this.password}@${this.host}:${this.port}/${this.name}`;
  }
}
