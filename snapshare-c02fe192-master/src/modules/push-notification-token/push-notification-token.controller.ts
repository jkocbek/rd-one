import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { appConstants } from '~modules/app/app.constants';
import { GetVerifiedUser } from '~modules/auth/decorators/get-verified-user.decorator';
import { VerificationGuard } from '~modules/auth/guards/verification.guard';
import { IVerifiedUser } from '~modules/auth/interfaces/verified-user.interface';

import { PushNotificationTokenDto } from './dtos/push-notification-token.dto';
import { PushNotificationTokenPostDto } from './dtos/push-notification-token.post.dto';
import { PushNotificationTokenService } from './push-notification-token.service';

@ApiTags('Push Notification Token')
@Controller('push-notification-token')
export class PushNotificationTokenController {
  constructor(private readonly pushNotificationTokenService: PushNotificationTokenService) {}

  @Post('/')
  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @ApiOperation({ summary: 'Create Push Notification Token' })
  @ApiOkResponse({ type: PushNotificationTokenDto })
  async create(
    @GetVerifiedUser() user: IVerifiedUser,
    @Body() body: PushNotificationTokenPostDto,
  ): Promise<PushNotificationTokenDto> {
    const pushNotificationToken = await this.pushNotificationTokenService.create({
      token: body.token,
      userId: user.id,
    });

    return PushNotificationTokenDto.create(pushNotificationToken);
  }
}
