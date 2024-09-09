import { PaginatedPostsStatus } from '../enums/paginated-posts-status.enum';
export interface IPaginatedPostsFilter {
  // Basic
  query?: string;
  status?: PaginatedPostsStatus;
  createdAt?: Date;

  // Arrays
  statuses?: PaginatedPostsStatus[];
}
