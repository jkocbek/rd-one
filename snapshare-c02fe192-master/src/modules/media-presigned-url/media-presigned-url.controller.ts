import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { appConstants } from '~modules/app/app.constants';
import { GetVerifiedUser } from '~modules/auth/decorators/get-verified-user.decorator';
import { VerificationGuard } from '~modules/auth/guards/verification.guard';
import { IVerifiedUser } from '~modules/auth/interfaces/verified-user.interface';

import { MediaPresignedUrlDto } from './dtos/media-presigned-url.dto';
import { MediaPresignedUrlPostDto } from './dtos/media-presigned-url.post.dto';
import { MediaPresignedUrlService } from './media-presigned-url.service';

@ApiTags('Media Presigned Url')
@Controller('media-presigned-url')
export class MediaPresignedUrlController {
  constructor(private readonly mediaPresignedUrlService: MediaPresignedUrlService) {}

  @ApiBearerAuth(appConstants.swagger.accessToken)
  @UseGuards(VerificationGuard)
  @Post('/')
  @ApiOperation({ summary: 'Create Presigned Url' })
  @ApiOkResponse({ type: MediaPresignedUrlDto })
  async createPresignedUrl(
    @GetVerifiedUser() user: IVerifiedUser,
    @Body() body: MediaPresignedUrlPostDto,
  ): Promise<MediaPresignedUrlDto> {
    const mediaPresignedUrl = await this.mediaPresignedUrlService.createPresignedUrl(user.id, body.use);

    return MediaPresignedUrlDto.create(mediaPresignedUrl);
  }
}
