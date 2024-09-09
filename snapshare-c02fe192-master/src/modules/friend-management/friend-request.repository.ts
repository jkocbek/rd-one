// src/modules/friend-management/friend-request.repository.ts
import { IFriendRequest } from '~modules/friend-management/interfaces/friend-request.interface';
import { IFriendRequestCreate } from '~modules/friend-management/interfaces/friend-request-create.interface';
import { IFriendRequestUpdate } from '~modules/friend-management/interfaces/friend-request-update.interface';

export interface IFriendRequestRepository {
  createFriendRequest(request: IFriendRequestCreate): Promise<IFriendRequest>;
  updateFriendRequest(request: IFriendRequestUpdate): Promise<IFriendRequest>;
  deleteFriendRequest(id: string): Promise<void>;
  listFriends(userId: string): Promise<string[]>;
}
