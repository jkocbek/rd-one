import { Expose, Type } from 'class-transformer';
import { plainToInstance } from 'class-transformer';
import { IsArray, IsNumber, IsOptional, Max, Min, ValidateNested } from 'class-validator';
import { validateSync } from 'class-validator';

import { IOrderItem } from '~common/interfaces/order.item.interface';

import { appConstants } from '~modules/app/app.constants';

import { OrderItemDto } from './order.item.dto';

interface IPaginatedListQuery<QueryOptionsFilter> {
  page: number;
  limit: number;
  order?: IOrderItem[];
  filter?: QueryOptionsFilter;
}

export class PaginatedListQueryDto<QueryOptionsFilter = undefined> {
  static readonly PAGE_KEY = 'page';
  static readonly LIMIT_KEY = 'limit';
  static readonly ORDER_KEY = 'order';
  static readonly FILTER_KEY = 'filter';

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @Min(appConstants.pagination.page.min)
  page: number = appConstants.pagination.page.default;

  @Expose()
  @IsNumber()
  @Type(() => Number)
  @Min(appConstants.pagination.limit.min)
  @Max(appConstants.pagination.limit.max)
  limit: number = appConstants.pagination.limit.default;

  @Expose()
  @IsArray()
  @Type(() => OrderItemDto)
  @ValidateNested({ each: true })
  @IsOptional()
  order?: OrderItemDto[];

  // manually resolve filter in 'create' method, because its generic type.
  @IsOptional()
  @Type(() => (typeHelper: { new (): QueryOptionsFilter }) => typeHelper)
  @ValidateNested()
  filter?: QueryOptionsFilter;

  static create<QueryOptionsFilter = undefined>(
    data: IPaginatedListQuery<QueryOptionsFilter>,
    FilterType: (new () => QueryOptionsFilter) | undefined = undefined,
  ): PaginatedListQueryDto<QueryOptionsFilter> {
    const ctOptions = {
      excludeExtraneousValues: true,
      exposeDefaultValues: true,
      exposeUnsetFields: false,
    };

    const dto = plainToInstance(PaginatedListQueryDto<QueryOptionsFilter>, data, ctOptions);
    dto.filter = data.filter && FilterType ? plainToInstance(FilterType, data.filter, ctOptions) : undefined;

    const issues = validateSync(dto, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (issues.length) {
      throw issues;
    }

    return dto;
  }
}
