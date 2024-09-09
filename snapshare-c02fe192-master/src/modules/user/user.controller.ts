import { Controller, Get, Param } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiPaginatedListResponse } from '~common/decorators/api-paginated-list-response.decorator';
import { PaginatedQuery } from '~common/decorators/paginated-query.decorator';
import { PaginatedListDto } from '~common/dtos/paginated-list.dto';
import { PaginatedListQueryDto } from '~common/dtos/paginated-list.query.dto';
import { UuidValidator } from '~common/validators/uuid.validator';

import { UserDto } from './dtos/user.dto';
import { UserFilter } from './filters/user.filter';
import { IUserFilter } from './interfaces/user.filter.interface';
import { UserService } from './user.service';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/')
  @ApiOperation({ summary: 'List Users' })
  @ApiPaginatedListResponse(ApiOkResponse, UserDto, ['id', 'email', 'createdAt'], UserFilter)
  async list(
    @PaginatedQuery(['id', 'email', 'createdAt'], UserFilter) query: PaginatedListQueryDto<IUserFilter>,
  ): Promise<PaginatedListDto<UserDto, UserFilter>> {
    const users = await this.userService.list(query);
    return PaginatedListDto.create<UserDto, IUserFilter>(users, UserDto.create);
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get User By Id' })
  @ApiOkResponse({ type: UserDto })
  async getById(@Param('id', UuidValidator) id: string): Promise<UserDto> {
    const user = await this.userService.findByIdOrThrow(id);
    return UserDto.create(user);
  }
}
