import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsUUID } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { appConstants } from '~modules/app/app.constants';

import { IUserSession } from '../interfaces/user-session.interface';

export class UserSessionDto {
  @Expose()
  @ApiProperty({ description: 'Id' })
  @IsUUID(appConstants.uuid.version)
  @IsNotEmpty()
  readonly id!: string;

  @Expose()
  @ApiProperty({ description: 'Created At' })
  @IsDate()
  @Type(() => Date)
  readonly createdAt!: Date;

  @Expose()
  @ApiProperty({ description: 'Expire At' })
  @IsDate()
  @Type(() => Date)
  readonly expireAt!: Date;

  static create(data: IUserSession): UserSessionDto {
    return plainToValidatedInstance(UserSessionDto, data);
  }
}
