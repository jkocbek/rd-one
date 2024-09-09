import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsArray, IsOptional, IsUUID, isUUID } from 'class-validator';

import { TransformInputToArray } from '~vendors/class-validator';

import { appConstants } from '~modules/app/app.constants';

export class UserSessionFilter {
  @Expose()
  @ApiPropertyOptional({ description: 'Ids' })
  @TransformInputToArray(isUUID)
  @IsArray()
  @IsUUID(appConstants.uuid.version, { each: true })
  @IsOptional()
  readonly ids?: string[];
}
