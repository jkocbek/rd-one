// src/modules/friend-management/friend.prisma-repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '~vendors/prisma/prisma.service';
import { IFriend } from './interfaces/friend.interface';
import { IFriendCreate } from './interfaces/friend-create.interface';
import { IFriendUpdate } from './interfaces/friend-update.interface';
import { IFriendRepository } from './friend.repository';
import { IFriendRequestRepository } from './friend-request.repository';
import { Friend, FriendRequest } from '@prisma/client';
import { IOrderItem } from '~modules/common/interfaces/order-item.interface';
import { IFriendRequest } from './interfaces/friend-request.interface';
import { IFriendRequestCreate } from './interfaces/friend-request-create.interface';
import { IFriendRequestUpdate } from './interfaces/friend-request-update.interface';
import { IFriendDelete } from './interfaces/friend-delete.interface';

@Injectable()
export class FriendPrismaRepository implements IFriendRepository, IFriendRequestRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFriendById(id: string): Promise<IFriend | null> {
    const friend = await this.prisma.friend.findUnique({
      where: { id },
    });
    return friend ? this.toDomain(friend) : null;
  }

  async createFriend(input: IFriendCreate): Promise<IFriend> {
    const friend = await this.prisma.friend.create({
      data: {
        userId: input.userId,
        friendId: input.friendId,
      },
    });
    return this.toDomain(friend);
  }

  async updateFriend(id: string, input: IFriendUpdate): Promise<IFriend> {
    const friend = await this.prisma.friend.update({
      where: { id },
      data: {
        userId: input.userId,
        friendId: input.friendId,
      },
    });
    return this.toDomain(friend);
  }

  async deleteFriend(id: string): Promise<void> {
    await this.prisma.friend.delete({
      where: { id },
    });
  }

  async findFriendsByUserId(
    userId: string,
    page: number,
    limit: number,
    order?: IOrderItem[],
    filter?: any,
  ): Promise<[IFriend[], number]> {
    const [friends, total] = await this.prisma.$transaction([
      this.prisma.friend.findMany({
        where: {
          OR: [{ userId }, { friendId: userId }],
          ...filter,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: order,
      }),
      this.prisma.friend.count({
        where: {
          OR: [{ userId }, { friendId: userId }],
          ...filter,
        },
      }),
    ]);

    return [friends.map(this.toDomain), total];
  }

  async findFriendRequestsByUserId(
    userId: string,
    page: number,
    limit: number,
    order?: IOrderItem[],
    filter?: any,
  ): Promise<[IFriendRequest[], number]> {
    const [friendRequests, total] = await this.prisma.$transaction([
      this.prisma.friendRequest.findMany({
        where: {
          OR: [{ senderId: userId }, { recipientId: userId }],
          ...filter,
        },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: order,
      }),
      this.prisma.friendRequest.count({
        where: {
          OR: [{ senderId: userId }, { recipientId: userId }],
          ...filter,
        },
      }),
    ]);

    return [friendRequests.map(this.toFriendRequestDomain), total];
  }

  async createFriendRequest(request: IFriendRequestCreate): Promise<IFriendRequest> {
    const friendRequest = await this.prisma.friendRequest.create({
      data: {
        senderId: request.senderId,
        recipientId: request.recipientId,
      },
    });
    return this.toFriendRequestDomain(friendRequest);
  }

  async updateFriendRequest(request: IFriendRequestUpdate): Promise<IFriendRequest> {
    const friendRequest = await this.prisma.friendRequest.update({
      where: {
        senderId_recipientId: {
          senderId: request.senderId,
          recipientId: request.recipientId,
        },
      },
      data: {
        senderId: request.senderId,
        recipientId: request.recipientId,
      },
    });
    return this.toFriendRequestDomain(friendRequest);
  }

  async deleteFriendRequest(id: string): Promise<void> {
    await this.prisma.friendRequest.delete({
      where: { id },
    });
  }

  async listFriends(userId: string): Promise<string[]> {
    const friends = await this.prisma.friend.findMany({
      where: {
        OR: [{ userId }, { friendId: userId }],
      },
    });

    return friends.map((friend) => (friend.userId === userId ? friend.friendId : friend.userId));
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

  private toFriendRequestDomain(friendRequest: FriendRequest): IFriendRequest {
    return {
      id: friendRequest.id,
      senderId: friendRequest.senderId,
      recipientId: friendRequest.recipientId,
      createdAt: friendRequest.createdAt,
      updatedAt: friendRequest.updatedAt,
    };
  }
}
