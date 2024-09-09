import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum } from 'class-validator';

import { MediaUse } from '../../media/enums/media.use.enum';

export class MediaPresignedUrlPostDto {
  @Expose()
  @ApiProperty({ description: 'Upload Media Use', enum: MediaUse })
  @IsEnum(MediaUse)
  readonly use!: MediaUse;
}
