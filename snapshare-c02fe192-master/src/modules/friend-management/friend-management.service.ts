import { Inject, Injectable, Logger } from '@nestjs/common';
import { IFriendRequestRepository as FriendRequestRepository } from '~modules/friend-management/friend-request.repository';
import { IFriendRequest } from '~modules/friend-management/interfaces/friend-request.interface';
import { IFriendRequestCreate } from '~modules/friend-management/interfaces/friend-request-create.interface';
import { IFriendRequestUpdate } from '~modules/friend-management/interfaces/friend-request-update.interface';
import { IFriendRepository as FriendRepository } from '~modules/friend-management/friend.repository';
import { IFriend } from '~modules/friend-management/interfaces/friend.interface';
import { IFriendCreate } from '~modules/friend-management/interfaces/friend-create.interface';
import { IFriendUpdate } from '~modules/friend-management/interfaces/friend-update.interface';
import { IPaginatedListQuery } from '~common/interfaces/paginated-list.query.interface';
import { IPaginatedList } from '~common/interfaces/paginated-list.interface';
import { IVerifiedUser } from '~modules/auth/interfaces/verified-user.interface';
import { UserManagementService } from '~modules/user-management/user-management.service';
import { PushNotificationType } from '~modules/push-notification/enums/push-notification.type.enum';
import { PushNotificationPayloads } from '~modules/push-notification/types/push-notification.payload.type';
import { PushNotificationService } from '~modules/push-notification/push-notification.service';

@Injectable()
export class FriendManagementService {
  static readonly LOGGER_KEY = 'friend-management-service-logger';

  constructor(
    @Inject(FriendManagementService.LOGGER_KEY)
    private readonly logger: Logger,
    @Inject('FriendRequestRepository')
    private readonly friendRequestRepository: FriendRequestRepository,
    @Inject('FriendRepository')
    private readonly friendRepository: FriendRepository,
    @Inject(UserManagementService)
    private readonly userManagementService: UserManagementService,
    @Inject(PushNotificationService)
    private readonly pushNotificationService: PushNotificationService,
  ) {}

  async createFriendRequest(friendRequest: IFriendRequestCreate): Promise<IFriendRequest> {
    return this.friendRequestRepository.createFriendRequest(friendRequest);
  }

  async updateFriendRequest(
    friendRequestId: string,
    friendRequestUpdate: IFriendRequestUpdate,
  ): Promise<IFriendRequest> {
    return this.friendRequestRepository.updateFriendRequest(friendRequestId, friendRequestUpdate);
  }

  async findFriendRequestById(friendRequestId: string): Promise<IFriendRequest | null> {
    return this.friendRequestRepository.findById(friendRequestId);
  }

  async deleteFriendRequest(friendRequestId: string): Promise<void> {
    return this.friendRequestRepository.deleteFriendRequest(friendRequestId);
  }

  async createFriend(friend: IFriendCreate): Promise<IFriend> {
    return this.friendRepository.createFriend(friend);
  }

  async updateFriend(friendId: string, friendUpdate: IFriendUpdate): Promise<IFriend> {
    return this.friendRepository.updateFriend(friendId, friendUpdate);
  }

  async findFriendById(friendId: string): Promise<IFriend | null> {
    return this.friendRepository.findById(friendId);
  }

  async deleteFriend(friendId: string): Promise<void> {
    return this.friendRepository.deleteFriend(friendId);
  }

  async listFriends(currentUser: IVerifiedUser, query: IPaginatedListQuery): Promise<IPaginatedList<IFriend>> {
    const { page, limit, order, filter } = query;
    const [items, totalItems] = await this.friendRepository.findByUserId(
      currentUser.id,
      page,
      limit,
      order,
      filter,
    );
    return {
      page,
      limit,
      order,
      filter,
      items,
      totalItems,
    };
  }

  async unfriendUser(currentUser: IVerifiedUser, friendId: string): Promise<void> {
    const friend = await this.friendRepository.findById(friendId);

    if (!friend || (friend.userId !== currentUser.id && friend.friendId !== currentUser.id)) {
      throw new Error('Friend relationship does not exist');
    }

    await this.friendRepository.deleteFriend(friend.id);

    const unfriendedUserId = friend.userId === currentUser.id ? friend.friendId : friend.userId;

    await this.pushNotificationService.sendBackgroundMessage(unfriendedUserId, PushNotificationType.UNFRIENDED);
  }

  async deleteFriendRequestForUser(currentUser: IVerifiedUser, friendRequestId: string): Promise<void> {
    const friendRequestExists = await this.friendRequestRepository.findById(friendRequestId);
    if (!friendRequestExists) {
      throw new Error('Friend request does not exist');
    }

    const isAddressedToUser = friendRequestExists.recipientId === currentUser.id;
    if (!isAddressedToUser) {
      throw new Error('Friend request is not addressed to the current user');
    }

    await this.friendRequestRepository.deleteFriendRequest(friendRequestId);
  }

  async acceptFriendRequest(currentUser: IVerifiedUser, friendRequestId: string): Promise<void> {
    const friendRequest = await this.friendRequestRepository.findById(friendRequestId);

    if (!friendRequest) {
      throw new Error('Friend request does not exist');
    }

    if (friendRequest.recipientId !== currentUser.id) {
      throw new Error('Friend request is not addressed to the current user');
    }

    await this.friendRepository.createFriend({
      userId: friendRequest.senderId,
      friendId: friendRequest.recipientId,
    });

    await this.friendRequestRepository.deleteFriendRequest(friendRequestId);

    await this.pushNotificationService.sendBackgroundMessage(friendRequest.senderId, PushNotificationType.POST_CREATED);
    await this.pushNotificationService.sendBackgroundMessage(
      friendRequest.recipientId,
      PushNotificationType.POST_CREATED,
    );
  }

  async listFriendRequests(
    currentUser: IVerifiedUser,
    query: IPaginatedListQuery,
  ): Promise<IPaginatedList<IFriendRequest>> {
    const { page, limit, order, filter } = query;
    const [items, totalItems] = await this.friendRequestRepository.findByUserId(
      currentUser.id,
      page,
      limit,
      order,
      filter,
    );
    return {
      page,
      limit,
      order,
      filter,
      items,
      totalItems,
    };
  }

  async sendFriendRequest(currentUser: IVerifiedUser, recipientId: string): Promise<IFriendRequest> {
    if (currentUser.id === recipientId) {
      throw new Error('You cannot send a friend request to yourself');
    }

    const isDuplicate = await this.friendRequestRepository.findBySenderAndRecipient(
      currentUser.id,
      recipientId,
    );
    if (isDuplicate) {
      throw new Error('Friend request already exists');
    }

    const friendRequest = await this.friendRequestRepository.createFriendRequest({
      senderId: currentUser.id,
      recipientId,
    });

    await this.pushNotificationService.sendBackgroundMessage(recipientId, PushNotificationType.POST_CREATED);

    return friendRequest;
  }

  async listAllFriends(userId: string): Promise<string[]> {
    return this.friendRepository.listFriends(userId);
  }

  async sendSilentPushNotification(notificationType: PushNotificationType, userIds: string[]): Promise<void> {
    for (const userId of userIds) {
      await this.pushNotificationService.sendBackgroundMessage(userId, notificationType);
    }
  }

  public async getAllFriends(userId: string): Promise<string[]> {
    return this.friendRepository.listFriends(userId);
  }

  public async getFriendsForUser(userId: string): Promise<string[]> {
    return this.friendRepository.listFriends(userId);
  }

  public async retrieveFriends(userId: string): Promise<string[]> {
    return this.friendRepository.listFriends(userId);
  }
}