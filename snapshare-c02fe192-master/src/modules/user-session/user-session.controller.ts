import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedListResponse } from '~common/decorators/api-paginated-list-response.decorator';
import { PaginatedQuery } from '~common/decorators/paginated-query.decorator';
import { PaginatedListDto } from '~common/dtos/paginated-list.dto';
import { PaginatedListQueryDto } from '~common/dtos/paginated-list.query.dto';
import { UuidValidator } from '~common/validators/uuid.validator';

import { appConstants } from '~modules/app/app.constants';
import { GetVerifiedUser } from '~modules/auth/decorators/get-verified-user.decorator';
import { AuthenticationGuard } from '~modules/auth/guards/authentication.guard';
import { VerificationGuard } from '~modules/auth/guards/verification.guard';
import { IVerifiedUser } from '~modules/auth/interfaces/verified-user.interface';

import { UserSessionDto } from './dtos/user-session.dto';
import { UserSessionFilter } from './filters/user-session.filter';
import { IUserSessionFilter } from './interfaces/user-session.filter.interface';
import { UserSessionService } from './user-session.service';

@ApiTags('User Session')
@Controller('user-session')
export class UserSessionController {
  constructor(private readonly userSessionService: UserSessionService) {}

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @Get('/')
  @ApiOperation({ summary: 'List User Sessions' })
  @ApiPaginatedListResponse(ApiOkResponse, UserSessionDto, [], UserSessionFilter)
  async list(
    @GetVerifiedUser() user: IVerifiedUser,
    @PaginatedQuery([], UserSessionFilter) query: PaginatedListQueryDto<UserSessionFilter>,
  ): Promise<PaginatedListDto<UserSessionDto, UserSessionFilter>> {
    const { id: userId } = user;
    const userSessions = await this.userSessionService.listForUser(userId, query);

    return PaginatedListDto.create<UserSessionDto, IUserSessionFilter>(userSessions, UserSessionDto.create);
  }

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @Get('/:id')
  @ApiOperation({ summary: 'Get User Session By Id' })
  @ApiOkResponse({ type: UserSessionDto })
  async getById(
    @GetVerifiedUser() user: IVerifiedUser,
    @Param('id', UuidValidator) sessionId: string,
  ): Promise<UserSessionDto> {
    const { id: userId } = user;
    const userSession = await this.userSessionService.findForUserByIdOrThrow(userId, sessionId);

    return UserSessionDto.create(userSession);
  }

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(AuthenticationGuard)
  @Delete('/')
  @ApiOperation({ summary: 'Delete All User Sessions' })
  async deleteAllUserSession(@GetVerifiedUser() user: IVerifiedUser): Promise<void> {
    const { id: userId } = user;
    await this.userSessionService.deleteAllForUser(userId);
  }

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(AuthenticationGuard)
  @Delete('/:id')
  @ApiOperation({ summary: 'Delete User Session By Id' })
  async deleteUserSessionById(
    @GetVerifiedUser() authenticationUser: IVerifiedUser,
    @Param('id', UuidValidator) sessionId: string,
  ): Promise<void> {
    const { id: userId } = authenticationUser;
    await this.userSessionService.deleteForUserById(userId, sessionId);
  }
}
