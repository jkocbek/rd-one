import { Controller, Get, Header } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiStatusDto } from '~modules/app/dtos/api-status.dto';

import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @ApiOperation({ summary: 'Get Status' })
  @ApiOkResponse({ type: ApiStatusDto })
  @Header('Access-Control-Allow-Origin', '*')
  @Header('Cache-Control', 'no-cache, no-store')
  public async getStatus(): Promise<ApiStatusDto> {
    const apiStatus = this.appService.getStatus();
    return ApiStatusDto.create(apiStatus);
  }
}
