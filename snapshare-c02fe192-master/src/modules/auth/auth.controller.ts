import { Body, Controller, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dtos/auth.login.dto';
import { AuthRefreshTokenDto } from './dtos/auth.refresh-token.dto';
import { AuthRegisterDto } from './dtos/auth.register.dto';
import { AuthResponseDto } from './dtos/auth.response.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login' })
  @ApiOkResponse({ type: AuthResponseDto })
  async login(@Body() body: AuthLoginDto): Promise<AuthResponseDto> {
    const authResponse = await this.authService.login(body);
    return AuthResponseDto.create(authResponse);
  }

  @Post('/register')
  @ApiOperation({ summary: 'Register' })
  @ApiOkResponse({ type: AuthResponseDto })
  async register(@Body() body: AuthRegisterDto): Promise<AuthResponseDto> {
    const authResponse = await this.authService.register(body);
    return AuthResponseDto.create(authResponse);
  }

  @Post('/refresh')
  @ApiOperation({ summary: 'Refresh Access Token' })
  @ApiOkResponse({ type: AuthResponseDto })
  async refreshToken(@Body() body: AuthRefreshTokenDto): Promise<AuthResponseDto> {
    const authResponse = await this.authService.refreshToken(body);
    return AuthResponseDto.create(authResponse);
  }
}
