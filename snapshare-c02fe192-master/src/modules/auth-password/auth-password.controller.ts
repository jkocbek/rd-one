import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthPasswordService } from './auth-password.service';
import { AuthPasswordForgotDto } from './dtos/auth-password.forgot.dto';
import { AuthPasswordResetDto } from './dtos/auth-password.reset.dto';

@ApiTags('Auth Password')
@Controller('auth-password')
export class AuthPasswordController {
  constructor(private readonly authPasswordService: AuthPasswordService) {}

  @Post('/forgot')
  @ApiOperation({ summary: 'Forgot Auth Password' })
  async forgotPassword(@Body() body: AuthPasswordForgotDto): Promise<void> {
    await this.authPasswordService.forgotPassword(body.email);
  }

  @Post('/reset')
  @ApiOperation({ summary: 'Reset Auth Password' })
  async resetPassword(@Body() body: AuthPasswordResetDto): Promise<void> {
    await this.authPasswordService.resetPassword(body);
  }
}
