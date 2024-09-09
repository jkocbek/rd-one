import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { INewPost } from '../interfaces/new-post.interface';

export class NewPostDTO {
  @ApiProperty({ description: 'Caption for the photo' })
  @IsString()
  @IsNotEmpty()
  readonly caption!: string;

  @ApiProperty({ description: 'URL of the uploaded photo' })
  @IsString()
  @IsNotEmpty()
  readonly photoUrl!: string;

  toDomain(): INewPost {
    return {
      caption: this.caption,
      photoUrl: this.photoUrl,
    };
  }
}
