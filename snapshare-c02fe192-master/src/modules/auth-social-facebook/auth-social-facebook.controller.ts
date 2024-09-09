import { Controller, Get, Query } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthSocialFacebookService } from './auth-social-facebook.service';
import { AuthSocialFacebookCredentialsDto } from './dtos/auth-social-facebook.credentials.dto';
import { AuthSocialFacebookDto } from './dtos/auth-social-facebook.dto';
import { AuthSocialFacebookCallbackQuery } from './queries/auth-social-facebook.callback.query';

@ApiTags('Auth Social Facebook')
@Controller('auth-social-facebook')
export class AuthSocialFacebookController {
  constructor(private readonly authSocialFacebookService: AuthSocialFacebookService) {}

  @Get('/credentials')
  @ApiOperation({ summary: 'Get Facebook Authentication Credentials' })
  @ApiOkResponse({ type: AuthSocialFacebookCredentialsDto })
  async getFacebookAuthenticationCredentials(): Promise<AuthSocialFacebookCredentialsDto> {
    const credentials = await this.authSocialFacebookService.getAuthenticationCredentials();
    return AuthSocialFacebookCredentialsDto.create(credentials);
  }

  @Get('/callback')
  @ApiOperation({ summary: 'Facebook Authentication Callback' })
  @ApiOkResponse({ type: AuthSocialFacebookDto })
  async getFacebookAuthenticationCallback(
    @Query() query: AuthSocialFacebookCallbackQuery,
  ): Promise<AuthSocialFacebookDto> {
    const socialFacebook = await this.authSocialFacebookService.facebookLogin(query.code, query.redirectUri);
    return AuthSocialFacebookDto.create(socialFacebook);
  }
}
