// src/modules/photo-sharing/post.repository.ts
import { IPost } from '~modules/photo-sharing/interfaces/post.interface';
import { IPostCreate } from '~modules/photo-sharing/interfaces/post-create.interface';
import { IPostUpdate } from '~modules/photo-sharing/interfaces/post-update.interface';
import { IPostDelete } from '~modules/photo-sharing/interfaces/post-delete.interface';
import { IPaginatedPostsFilter } from '~modules/photo-sharing/interfaces/paginated-posts-filter.interface';
import { IPaginatedList } from '~modules/photo-sharing/interfaces/paginated-list.interface';
import { IPaginatedListQuery } from '~modules/photo-sharing/interfaces/paginated-list-query.interface';

export interface PostRepository {
  createPost(input: IPostCreate): Promise<IPost>;
  updatePost(id: string, input: IPostUpdate): Promise<IPost>;
  findPostById(id: string): Promise<IPost | null>;
  deletePost(id: string): Promise<void>;
  softDeletePost(input: IPostDelete): Promise<IPost>;
  listPosts(query: IPaginatedListQuery<IPaginatedPostsFilter>): Promise<IPaginatedList<IPost, IPaginatedPostsFilter>>;
}
