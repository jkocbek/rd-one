import { ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsDate, IsEnum, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PaginatedPostsStatus } from '../enums/paginated-posts-status.enum';

export class PaginatedPostsFilter {
  // String - query
  @Expose()
  @ApiPropertyOptional({ description: 'Search by caption' })
  @IsString()
  @IsOptional()
  readonly query?: string;

  // Enum - status
  @Expose()
  @ApiPropertyOptional({ description: 'Filter by status', enum: PaginatedPostsStatus })
  @IsEnum(PaginatedPostsStatus)
  @IsOptional()
  readonly status?: PaginatedPostsStatus;

  // Date - createdAt
  @Expose()
  @ApiPropertyOptional({ description: 'Filter by creation date' })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  readonly createdAt?: Date;

  // Array of Enums - statuses
  @Expose()
  @ApiPropertyOptional({ description: 'Statuses', enum: PaginatedPostsStatus })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @IsArray()
  @IsEnum(PaginatedPostsStatus, { each: true })
  @IsOptional()
  readonly statuses?: PaginatedPostsStatus[];
}
