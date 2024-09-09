import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUrl, IsDateString } from 'class-validator';
import { IPost } from '../interfaces/post.interface';

export class PostResponseDTO {
  @ApiProperty({ description: 'Id of the post' })
  @IsString()
  @IsNotEmpty()
  readonly id!: string;

  @ApiProperty({ description: 'Caption of the post' })
  @IsString()
  @IsNotEmpty()
  readonly caption!: string;

  @ApiProperty({ description: 'URL of the photo' })
  @IsUrl()
  @IsNotEmpty()
  readonly photoUrl!: string;

  @ApiProperty({ description: 'Creation date of the post' })
  @IsDateString()
  @IsNotEmpty()
  readonly createdAt!: string;

  static fromDomain(post: IPost): PostResponseDTO {
    return {
      id: post.id,
      caption: post.caption,
      photoUrl: post.photoUrl,
      createdAt: post.createdAt.toISOString(),
    };
  }
}
