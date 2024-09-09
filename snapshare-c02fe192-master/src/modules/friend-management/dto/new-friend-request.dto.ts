import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { IVerifiedUser } from '~modules/auth/interfaces/verified-user.interface';

export class NewFriendRequestDTO {
  @ApiProperty({ description: 'ID of the user to send friend request to' })
  @IsUUID()
  @IsNotEmpty()
  recipientId!: string;

  toServiceArguments(currentUser: IVerifiedUser): { currentUser: IVerifiedUser; recipientId: string } {
    return { currentUser, recipientId: this.recipientId };
  }
}
