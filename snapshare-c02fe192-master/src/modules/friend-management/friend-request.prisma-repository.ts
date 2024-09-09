// src/modules/friend-management/friend-request.prisma-repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '~vendors/prisma/prisma.service';
import { IFriend } from './interfaces/friend.interface';
import { IFriendCreate } from './interfaces/friend-create.interface';
import { IFriendUpdate } from './interfaces/friend-update.interface';
import { IFriendDelete } from './interfaces/friend-delete.interface';
import { IFriendRepository } from './friend.repository';
import { IFriendRequestRepository } from './friend-request.repository';
import { Friend, FriendRequest } from '@prisma/client';
import { IFriendRequest } from './interfaces/friend-request.interface';
import { IFriendRequestCreate } from './interfaces/friend-request-create.interface';
import { IFriendRequestUpdate } from './interfaces/friend-request-update.interface';

@Injectable()
export class FriendPrismaRepository implements IFriendRepository, IFriendRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createFriend(input: IFriendCreate): Promise<IFriend> {
    const friend = await this.prisma.friend.create({
      data: {
        userId: input.userId,
        friendId: input.friendId,
      },
    });
    return this.toDomain(friend);
  }

  async updateFriend(friendId: string, input: IFriendUpdate): Promise<IFriend> {
    const friend = await this.prisma.friend.update({
      where: { id: friendId },
      data: {
        userId: input.userId,
        friendId: input.friendId,
      },
    });
    return this.toDomain(friend);
  }

  async deleteFriend(friendId: string): Promise<void> {
    await this.prisma.friend.delete({
      where: { id: friendId },
    });
  }

  async listFriends(userId: string): Promise<string[]> {
    const friends = await this.prisma.friend.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
      },
      select: {
        userId: true,
        friendId: true,
      },
    });

    return friends.map((friend) => (friend.userId === userId ? friend.friendId : friend.userId));
  }

  async createFriendRequest(input: IFriendRequestCreate): Promise<IFriendRequest> {
    const friendRequest = await this.prisma.friendRequest.create({
      data: {
        senderId: input.senderId,
        recipientId: input.recipientId,
      },
    });
    return this.toDomainFriendRequest(friendRequest);
  }

  async updateFriendRequest(input: IFriendRequestUpdate): Promise<IFriendRequest> {
    const friendRequest = await this.prisma.friendRequest.update({
      where: { senderId_recipientId: { senderId: input.senderId, recipientId: input.recipientId } },
      data: {
        senderId: input.senderId,
        recipientId: input.recipientId,
      },
    });
    return this.toDomainFriendRequest(friendRequest);
  }

  async deleteFriendRequest(id: string): Promise<void> {
    await this.prisma.friendRequest.delete({
      where: { id },
    });
  }

  private toDomain(friend: Friend): IFriend {
    return {
      id: friend.id,
      userId: friend.userId,
      friendId: friend.friendId,
      createdAt: friend.createdAt,
      updatedAt: friend.updatedAt,
    };
  }

  private toDomainFriendRequest(friendRequest: FriendRequest): IFriendRequest {
    return {
      id: friendRequest.id,
      senderId: friendRequest.senderId,
      recipientId: friendRequest.recipientId,
      createdAt: friendRequest.createdAt,
      updatedAt: friendRequest.updatedAt,
    };
  }
}
