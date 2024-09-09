import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { appConstants } from '~modules/app/app.constants';
import { GetVerifiedUser } from '~modules/auth/decorators/get-verified-user.decorator';
import { VerificationGuard } from '~modules/auth/guards/verification.guard';
import { IVerifiedUser } from '~modules/auth/interfaces/verified-user.interface';

import { UserMeDto } from './dtos/user-me.dto';
import { UserMeService } from './user-me.service';

@ApiTags('User Me')
@Controller('user-me')
export class UserMeController {
  constructor(private readonly userMeService: UserMeService) {}

  @Get('/')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @ApiOperation({ summary: 'Get Me' })
  @ApiOkResponse({ type: UserMeDto })
  async getMe(@GetVerifiedUser() user: IVerifiedUser): Promise<UserMeDto> {
    const userMe = await this.userMeService.findMeById(user.id);
    return UserMeDto.create(userMe);
  }
}
