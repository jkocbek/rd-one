import { applyDecorators } from '@nestjs/common';
import { ApiExtraModels, ApiQuery, ApiResponseOptions, getSchemaPath } from '@nestjs/swagger';

import { PaginatedListDto } from '~common/dtos/paginated-list.dto';
import { Constructor } from '~common/types/constructor.type';

import { appConstants } from '~modules/app/app.constants';

// eslint-disable-next-line @typescript-eslint/ban-types
export const ApiPaginatedListResponse = <ItemDto extends Function, ItemFilter = {}>(
  response: (options?: ApiResponseOptions) => MethodDecorator & ClassDecorator,
  itemDto: ItemDto,
  orders: string[] = [],
  itemFilter: Constructor<ItemFilter> | undefined = undefined,
): any => {
  const appliedDecorators = [];

  appliedDecorators.push(
    // ensure base dtos are included
    ApiExtraModels(itemDto),
    ApiExtraModels(PaginatedListDto),

    // add paginated list query swagger decorators
    ApiQuery({
      name: 'page',
      type: 'number',
      required: false,
      description: `Represents pagination page: min ${appConstants.pagination.page.min}, default ${appConstants.pagination.page.default}.`,
    }),
    ApiQuery({
      name: 'limit',
      type: 'number',
      required: false,
      description: `Represents pagination limit: min ${appConstants.pagination.limit.min}, max ${appConstants.pagination.limit.max}, default ${appConstants.pagination.limit.default}.`,
    }),
  );

  if (orders.length > 0) {
    const orderExamples = orders.map((order) => `+${order},-${order}`).join(',');
    appliedDecorators.push(
      ApiQuery({
        name: 'order',
        type: 'string',
        required: false,
        description: `Represents format and direction of ordering. Possible orders: ${orderExamples}.`,
      }),
    );
  }

  if (itemFilter) {
    appliedDecorators.push(
      ApiExtraModels(itemFilter),
      ApiQuery({
        name: PaginatedListDto.FILTER_PROPERTY,
        required: false,
        type: 'object',
        schema: {
          $ref: getSchemaPath(itemFilter),
        },
      }),
      applyDecorators(
        // add paginated list response dto swagger decorators
        response({
          schema: {
            title: `PaginatedListResponseOf${itemDto.name}`,
            allOf: [
              { $ref: getSchemaPath(PaginatedListDto) },
              {
                properties: {
                  [PaginatedListDto.ITEMS_PROPERTY]: {
                    type: 'array',
                    items: { $ref: getSchemaPath(itemDto) },
                  },
                  [PaginatedListDto.FILTER_PROPERTY]: {
                    type: 'object',
                    $ref: getSchemaPath(itemFilter),
                  },
                },
              },
            ],
          },
        }),
      ),
    );
  } else {
    appliedDecorators.push(
      applyDecorators(
        response({
          schema: {
            title: `PaginatedListResponseOf${itemDto.name}`,
            allOf: [
              { $ref: getSchemaPath(PaginatedListDto) },
              {
                properties: {
                  [PaginatedListDto.ITEMS_PROPERTY]: {
                    type: 'array',
                    items: { $ref: getSchemaPath(itemDto) },
                  },
                },
              },
            ],
          },
        }),
      ),
    );
  }

  return applyDecorators(...appliedDecorators);
};
