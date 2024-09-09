import { IOrderItem } from './order.item.interface';

export interface IPaginatedList<ItemType, QueryOptionsFilter = undefined> {
  page: number;
  limit: number;
  order?: IOrderItem[];
  filter?: QueryOptionsFilter;
  items: ItemType[];
  totalItems: number;
}
