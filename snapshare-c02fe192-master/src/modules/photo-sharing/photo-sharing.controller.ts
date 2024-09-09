import { Controller, Delete, Get, Param, Post, Body, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags, ApiOkResponse } from '@nestjs/swagger';
import { appConstants } from '~modules/app/app.constants';
import { AllowedUserRoles } from '~modules/auth/decorators/allowed-user-roles.decorator';
import { GetVerifiedUser } from '~modules/auth/decorators/get-verified-user.decorator';
import { VerificationGuard } from '~modules/auth/guards/verification.guard';
import { IVerifiedUser } from '~modules/auth/interfaces/verified-user.interface';
import { UserRole } from '~modules/user/enums/user.role.enum';
import { PhotoSharingService } from './photo-sharing.service';
import { ApiPaginatedListResponse } from '~common/decorators/api-paginated-list-response.decorator';
import { PaginatedQuery } from '~common/decorators/paginated-query.decorator';
import { PaginatedListQueryDto } from '~common/dtos/paginated-list.query.dto';
import { PaginatedListDto } from '~common/dtos/paginated-list.dto';
import { IPaginatedListQuery } from '~common/interfaces/paginated-list.query.interface';
import { IPaginatedList } from '~common/interfaces/paginated-list.interface';
import { PaginatedPostsFilter } from '../filters/paginated-posts.filter';
import { IPaginatedPostsFilter } from '../interfaces/paginated-posts-filter.interface';
import { PostResponseDTO } from '../dto/post-response.dto';
import { NewPostDTO } from '../dto/new-post.dto';

@ApiTags('PhotoSharing')
@Controller('photo-sharing')
export class PhotoSharingController {
  constructor(private photoSharingService: PhotoSharingService) {}

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @AllowedUserRoles([UserRole.USER, UserRole.ADMIN])
  @Delete('/posts/:id')
  @ApiOperation({ summary: 'Delete a post' })
  async deletePost(@GetVerifiedUser() user: IVerifiedUser, @Param('id') id: string): Promise<void> {
    await this.photoSharingService.softDeletePost(id, 'Post deleted by user request', user);
  }

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @AllowedUserRoles([UserRole.USER])
  @Get('/posts')
  @ApiOperation({ summary: 'List Posts' })
  @ApiPaginatedListResponse(ApiOkResponse, PostResponseDTO, ['userId', 'createdAt'], PaginatedPostsFilter)
  async listPosts(
    @GetVerifiedUser() currentUser: IVerifiedUser,
    @PaginatedQuery(['userId', 'createdAt'], PaginatedPostsFilter) query: PaginatedListQueryDto<IPaginatedPostsFilter>,
  ): Promise<PaginatedListDto<PostResponseDTO, IPaginatedPostsFilter>> {
    const posts = await this.photoSharingService.listPosts(currentUser, query);
    return PaginatedListDto.create<PostResponseDTO, IPaginatedPostsFilter>(posts, PostResponseDTO.fromDomain);
  }

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @AllowedUserRoles([UserRole.USER])
  @Post('/posts')
  @ApiOperation({ summary: 'Create a new post' })
  @ApiOkResponse({ type: PostResponseDTO })
  async createPost(@GetVerifiedUser() user: IVerifiedUser, @Body() newPostDto: NewPostDTO): Promise<PostResponseDTO> {
    const newPost = newPostDto.toDomain();
    const media: any = { url: newPostDto.photoUrl, use: 'PHOTO_UPLOAD', status: 'uploaded' }; // Assuming media object creation
    const createdPost = await this.photoSharingService.createNewPost(user, newPost, media);
    return PostResponseDTO.fromDomain(createdPost);
  }
}