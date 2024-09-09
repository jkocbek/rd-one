import { Controller, Get, UseGuards, Delete, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiOkResponse } from '@nestjs/swagger';
import { FriendManagementService } from './friend-management.service';
import { VerificationGuard } from '~modules/auth/guards/verification.guard';
import { AllowedUserRoles } from '~modules/auth/decorators/allowed-user-roles.decorator';
import { GetVerifiedUser } from '~modules/auth/decorators/get-verified-user.decorator';
import { IVerifiedUser } from '~modules/auth/interfaces/verified-user.interface';
import { PaginatedQuery } from '~common/decorators/paginated-query.decorator';
import { PaginatedListQueryDto } from '~common/dtos/paginated-list.query.dto';
import { PaginatedListDto } from '~common/dtos/paginated-list.dto';
import { ApiPaginatedListResponse } from '~common/decorators/api-paginated-list-response.decorator';
import { FriendResponseDto } from './dto/friend-response.dto';
import { FriendRequestResponseDto } from './dto/friend-request-response.dto';
import { NewFriendRequestDTO } from './dto/new-friend-request.dto';
import { appConstants } from '~config/app.constants';
import { UserRole } from '~modules/auth/enums/user-role.enum';

@ApiTags('FriendManagement')
@Controller('friend-management')
export class FriendManagementController {
  constructor(private friendManagementService: FriendManagementService) {}

  @Get('/friends')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @AllowedUserRoles([UserRole.USER])
  @ApiOperation({ summary: 'List Friends' })
  @ApiPaginatedListResponse(ApiOkResponse, FriendResponseDto)
  async listFriends(
    @GetVerifiedUser() currentUser: IVerifiedUser,
    @PaginatedQuery() query: PaginatedListQueryDto,
  ): Promise<PaginatedListDto<FriendResponseDto>> {
    const friends = await this.friendManagementService.listFriends(currentUser, query);
    return PaginatedListDto.create<FriendResponseDto>(friends, (FriendResponseDto as any).fromDomain);
  }

  @Delete('/friends/:id')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @AllowedUserRoles([UserRole.USER])
  @ApiOperation({ summary: 'Delete Friend' })
  @ApiOkResponse({ description: 'Friend deleted successfully' })
  async deleteFriend(@GetVerifiedUser() currentUser: IVerifiedUser, @Param('id') id: string): Promise<void> {
    await this.friendManagementService.unfriendUser(currentUser, id);
  }

  @Delete('/friend-requests/:id')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @AllowedUserRoles([UserRole.USER])
  @ApiOperation({ summary: 'Delete Friend Request' })
  @ApiOkResponse({ description: 'Friend request deleted successfully' })
  async deleteFriendRequest(@GetVerifiedUser() currentUser: IVerifiedUser, @Param('id') id: string): Promise<void> {
    await this.friendManagementService.deleteFriendRequestForUser(currentUser, id);
  }

  @Post('/friend-requests/:id')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @AllowedUserRoles([UserRole.USER])
  @ApiOperation({ summary: 'Accept Friend Request' })
  @ApiOkResponse({ description: 'Friend request accepted successfully' })
  async acceptFriendRequest(@GetVerifiedUser() currentUser: IVerifiedUser, @Param('id') id: string): Promise<void> {
    await this.friendManagementService.acceptFriendRequest(currentUser, id);
  }

  @Get('/friend-requests')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @AllowedUserRoles([UserRole.USER])
  @ApiOperation({ summary: 'List Friend Requests' })
  @ApiPaginatedListResponse(ApiOkResponse, FriendRequestResponseDto)
  async listFriendRequests(
    @GetVerifiedUser() currentUser: IVerifiedUser,
    @PaginatedQuery() query: PaginatedListQueryDto,
  ): Promise<PaginatedListDto<FriendRequestResponseDto>> {
    const friendRequests = await this.friendManagementService.listFriendRequests(currentUser, query);
    return PaginatedListDto.create<FriendRequestResponseDto>(
      friendRequests,
      (FriendRequestResponseDto as any).fromDomain,
    );
  }

  @Post('/friend-requests')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @AllowedUserRoles([UserRole.USER])
  @ApiOperation({ summary: 'Send Friend Request' })
  @ApiOkResponse({ type: FriendRequestResponseDto })
  async sendFriendRequest(
    @GetVerifiedUser() currentUser: IVerifiedUser,
    @Body() newFriendRequestDto: NewFriendRequestDTO,
  ): Promise<FriendRequestResponseDto> {
    const { currentUser: user, recipientId } = newFriendRequestDto.toServiceArguments(currentUser);
    const friendRequest = await this.friendManagementService.sendFriendRequest(user, recipientId);
    return FriendRequestResponseDto.fromDomain(friendRequest);
  }
}
