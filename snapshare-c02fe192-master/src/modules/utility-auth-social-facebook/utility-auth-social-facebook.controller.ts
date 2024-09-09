import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { UtilityAuthSocialFacebookService } from './utility-auth-social-facebook.service';

@ApiTags('[Utility] Auth Social Facebook')
@Controller('utility-auth-social-facebook')
export class UtilityAuthSocialFacebookController {
  constructor(private readonly utilityAuthSocialFacebookService: UtilityAuthSocialFacebookService) {}

  @Get('/generate')
  @ApiOperation({
    summary: 'Facebook Generate Authentication Url. ❗ This endpoint is not meant to be used by frontend applications.',
  })
  @ApiOkResponse({ type: String })
  async generate(): Promise<string> {
    const url = await this.utilityAuthSocialFacebookService.generateAuthenticationUrl();
    return url;
  }
}
