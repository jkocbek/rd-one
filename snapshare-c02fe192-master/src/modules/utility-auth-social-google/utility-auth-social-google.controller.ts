import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UtilityAuthSocialGoogleService } from './utility-auth-social-google.service';

@ApiTags('[Utility] Auth Social Google')
@Controller('utility-auth-social-google')
export class UtilityAuthSocialGoogleController {
  constructor(private readonly utilityAuthSocialGoogleService: UtilityAuthSocialGoogleService) {}

  @Get('/generate')
  @ApiOperation({
    summary: 'Google Generate Authentication Url. ❗ This endpoint is not meant to be used by frontend applications.',
  })
  @ApiOkResponse({ type: String })
  async generate(): Promise<string> {
    const url = await this.utilityAuthSocialGoogleService.generateAuthenticationUrl();
    return url;
  }
}
