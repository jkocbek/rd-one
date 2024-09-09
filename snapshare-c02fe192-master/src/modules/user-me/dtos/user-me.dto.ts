import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { appConstants } from '~modules/app/app.constants';

import { IUserMe } from '../interfaces/user-me.interface';

export class UserMeDto {
  @Expose()
  @ApiProperty({ description: 'Id' })
  @IsUUID(appConstants.uuid.version)
  @IsNotEmpty()
  readonly id!: string;

  @Expose()
  @ApiProperty({ description: 'Email' })
  @IsEmail()
  @IsNotEmpty()
  readonly email!: string;

  static create(data: IUserMe): UserMeDto {
    return plainToValidatedInstance(UserMeDto, data);
  }
}
