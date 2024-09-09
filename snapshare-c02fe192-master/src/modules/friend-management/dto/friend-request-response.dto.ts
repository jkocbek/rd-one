import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsISO8601 } from 'class-validator';
import { IFriendRequest } from '../interfaces/friend-request.interface';

export class FriendRequestResponseDto {
  @ApiProperty({ description: 'ID of the friend request' })
  @IsString()
  @IsNotEmpty()
  readonly id!: string;

  @ApiProperty({ description: 'ID of the user who sent the friend request' })
  @IsString()
  @IsNotEmpty()
  readonly senderId!: string;

  @ApiProperty({ description: 'ID of the user who received the friend request' })
  @IsString()
  @IsNotEmpty()
  readonly recipientId!: string;

  @ApiProperty({ description: 'Timestamp when the friend request was created' })
  @IsISO8601()
  @IsNotEmpty()
  readonly createdAt!: string;

  static fromDomain(friendRequest: IFriendRequest): FriendRequestResponseDto {
    return new FriendRequestResponseDto(
      friendRequest.id,
      friendRequest.senderId,
      friendRequest.recipientId,
      friendRequest.createdAt.toISOString(),
    );
  }

  constructor(id: string, senderId: string, recipientId: string, createdAt: string) {
    this.id = id;
    this.senderId = senderId;
    this.recipientId = recipientId;
    this.createdAt = createdAt;
  }
}
