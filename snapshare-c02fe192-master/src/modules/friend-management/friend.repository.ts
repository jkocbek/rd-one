// src/modules/friend-management/friend.repository.ts
import { IFriend } from '~modules/friend-management/interfaces/friend.interface';
import { IFriendCreate } from '~modules/friend-management/interfaces/friend-create.interface';
import { IFriendUpdate } from '~modules/friend-management/interfaces/friend-update.interface';
import { IFriendDelete } from '~modules/friend-management/interfaces/friend-delete.interface';

export interface IFriendRepository {
  createFriend(friendCreate: IFriendCreate): Promise<IFriend>;
  updateFriend(friendId: string, friendUpdate: IFriendUpdate): Promise<IFriend>;
  deleteFriend(friendId: string): Promise<void>;
  listFriends(userId: string): Promise<string[]>;
}
