import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsUUID } from 'class-validator';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { appConstants } from '~modules/app/app.constants';

import { IUser } from '../interfaces/user.interface';

export class UserDto {
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

  static create(data: IUser): UserDto {
    return plainToValidatedInstance(UserDto, data);
  }
}
