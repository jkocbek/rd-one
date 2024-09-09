import { OrderDirection } from '~common/types/order.direction.type';

export interface IOrderItem {
  propertyName: string;
  direction: OrderDirection;
}
