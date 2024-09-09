import { Expose } from 'class-transformer';
import { IsIn, IsNotEmpty, IsString } from 'class-validator';

import { IOrderItem } from '~common/interfaces/order.item.interface';
import { OrderDirection } from '~common/types/order.direction.type';

import { plainToValidatedInstance } from '~vendors/class-validator';

export class OrderItemDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  readonly propertyName!: string;

  @Expose()
  @IsIn(['ASC', 'DESC'] as OrderDirection[])
  readonly direction!: OrderDirection;

  static create(data: IOrderItem): OrderItemDto {
    return plainToValidatedInstance(OrderItemDto, data);
  }
}
