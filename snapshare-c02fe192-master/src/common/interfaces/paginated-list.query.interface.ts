import { IOrderItem } from './order.item.interface';

export interface IPaginatedListQuery<QueryOptionsFilter = undefined> {
  page: number;
  limit: number;
  order?: IOrderItem[];
  filter?: QueryOptionsFilter;
}
