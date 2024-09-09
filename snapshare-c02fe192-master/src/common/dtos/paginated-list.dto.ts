import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, ValidateNested } from 'class-validator';

import { IPaginatedList } from '~common/interfaces/paginated-list.interface';

import { plainToValidatedInstance } from '~vendors/class-validator';

import { OrderItemDto } from './order.item.dto';

export class PaginatedListDto<PresentationItemType, QueryOptionsFilter = undefined> {
  static ITEMS_PROPERTY = 'items';
  static FILTER_PROPERTY = 'filter';

  @Expose()
  @ApiProperty({ description: 'Page' })
  @IsNumber()
  readonly page!: number;

  @Expose()
  @ApiProperty({ description: 'Limit' })
  @IsNumber()
  readonly limit!: number;

  @Expose()
  @ApiPropertyOptional({ description: 'Limit' })
  @IsArray()
  @ValidateNested()
  @Type(() => OrderItemDto)
  @IsOptional()
  readonly order?: OrderItemDto[];

  @Expose()
  @ApiPropertyOptional({ description: 'Filter' })
  @ValidateNested()
  @IsOptional()
  readonly filter?: QueryOptionsFilter;

  @Expose()
  @ApiPropertyOptional({ description: 'Items' })
  @IsArray()
  @ValidateNested()
  @IsOptional()
  readonly items!: PresentationItemType[];

  @Expose()
  @ApiProperty({ description: 'Total Items' })
  @IsNumber()
  readonly totalItems!: number;

  static create<PresentationItemType, QueryOptionsFilter = undefined>(
    data: IPaginatedList<any, QueryOptionsFilter>,
    itemConverter: (data: any) => PresentationItemType,
  ): PaginatedListDto<PresentationItemType, QueryOptionsFilter> {
    return plainToValidatedInstance(PaginatedListDto<PresentationItemType, QueryOptionsFilter>, {
      ...data,
      items: data.items.map((item) => itemConverter(item)),
    });
  }
}
