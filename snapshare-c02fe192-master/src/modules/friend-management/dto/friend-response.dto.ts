import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID, IsString } from 'class-validator';

export class FriendResponseDto {
  @ApiProperty({ description: 'ID of the friend relationship' })
  @IsUUID()
  @IsNotEmpty()
  readonly id!: string;

  @ApiProperty({ description: 'ID of the user' })
  @IsUUID()
  @IsNotEmpty()
  readonly userId!: string;

  @ApiProperty({ description: 'ID of the friend' })
  @IsUUID()
  @IsNotEmpty()
  readonly friendId!: string;

  @ApiProperty({ description: 'Timestamp when the friendship was created' })
  @IsString()
  @IsNotEmpty()
  readonly createdAt!: string;
}
