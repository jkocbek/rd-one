import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthSocialGoogleService } from './auth-social-google.service';
import { AuthSocialGoogleCredentialsDto } from './dtos/auth-social-google.credentials.dto';
import { AuthSocialGoogleDto } from './dtos/auth-social-google.dto';
import { AuthSocialGoogleCallbackQuery } from './queries/auth-social-google.callback.query';

@ApiTags('Auth Social Google')
@Controller('auth-social-google')
export class AuthSocialGoogleController {
  constructor(private readonly authSocialGoogleService: AuthSocialGoogleService) {}

  @Get('/credentials')
  @ApiOperation({ summary: 'Get Google Authentication Credentials' })
  @ApiOkResponse({ type: AuthSocialGoogleCredentialsDto })
  async getGoogleAuthenticationCredentials(): Promise<AuthSocialGoogleCredentialsDto> {
    const credentials = await this.authSocialGoogleService.getAuthenticationCredentials();
    return AuthSocialGoogleCredentialsDto.create(credentials);
  }

  @Get('/callback')
  @ApiOperation({ summary: 'Google Authentication Callback' })
  @ApiOkResponse({ type: AuthSocialGoogleDto })
  async getGoogleAuthenticationCallback(@Query() query: AuthSocialGoogleCallbackQuery): Promise<AuthSocialGoogleDto> {
    const socialGoogle = await this.authSocialGoogleService.googleLogin(query.code, query.redirectUri);
    return AuthSocialGoogleDto.create(socialGoogle);
  }
}
