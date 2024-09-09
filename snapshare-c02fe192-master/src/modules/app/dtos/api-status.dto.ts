import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { IApiStatus } from '~modules/app/interfaces/api-status.interface';

export class ApiStatusDto {
  @Expose()
  @ApiProperty({
    description: 'Api Status Uptime',
    example: '1d 12h 10m 30s',
  })
  @IsString()
  @IsNotEmpty()
  readonly uptime!: string;

  @Expose()
  @ApiProperty({
    description: 'Api Status Stage',
    example: 'project-dev',
  })
  @IsString()
  @IsNotEmpty()
  readonly stage!: string;

  @Expose()
  @ApiProperty({
    description: 'Api Status Version',
    example: 'project-dev-1.0.0',
  })
  @IsString()
  @IsNotEmpty()
  readonly version!: string;

  @Expose()
  @ApiProperty({
    description: 'Api Status Release (Git Hash Format)',
    example: '9eabf5b536662000f79978c4d1b6e4eff5c8d785',
  })
  @IsString()
  @IsNotEmpty()
  readonly release!: string;

  @Expose()
  @ApiProperty({
    description: 'Api Status Build Time',
    example: '2022-01-01T10:00:00.000Z',
  })
  @IsString()
  @IsNotEmpty()
  readonly buildTime!: string;

  static create(data: IApiStatus): ApiStatusDto {
    return plainToValidatedInstance(ApiStatusDto, data);
  }
}
