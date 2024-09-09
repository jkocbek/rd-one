import { NotImplementedException } from '@nestjs/common';

import { IOrderItem } from '~common/interfaces/order.item.interface';

import { IPaginationOrderByPrisma } from '../interfaces/pagination-order-by.prisma.interface';

export function generatePaginationOrderByPrisma(listOrder?: IOrderItem[]): IPaginationOrderByPrisma[] | undefined {
  if (!listOrder) {
    return undefined;
  }

  const result = listOrder.map((orderVal) => {
    let ordering: 'asc' | 'desc';
    switch (orderVal.direction) {
      case 'ASC': {
        ordering = 'asc';
        break;
      }

      case 'DESC': {
        ordering = 'desc';
        break;
      }

      default: {
        throw new NotImplementedException(`Unknown orderVal direction '${orderVal.direction}'.`);
      }
    }

    return { [orderVal.propertyName]: ordering };
  });

  return result;
}
