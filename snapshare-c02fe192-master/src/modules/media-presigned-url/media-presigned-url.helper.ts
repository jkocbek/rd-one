import { NotImplementedException } from '@nestjs/common';

import { IMediaUploadProviderPresignedUrlData } from '~vendors/media-upload-provider/interfaces/media-upload-provider.presigned-url.data';
import { MediaUploadProviderMethod } from '~vendors/media-upload-provider/types/media-upload-provider.method.type';

import { MediaPresignedUrlUploadMethod } from './enums/media-presigned-url.upload-method.enum';
import { IMediaPresignedUrl } from './interfaces/media-presigned-url.interface';

export class MediaPresignedUrlHelper {
  static fromIMediaUploadProviderPresignedUrlData(data: IMediaUploadProviderPresignedUrlData): IMediaPresignedUrl {
    return {
      uploadMethod: MediaPresignedUrlHelper.convertMediaUploadProviderMethod(data.uploadMethod),
      uploadUrl: data.uploadUrl,
      mediaUrl: data.mediaUrl,
      fields: data.fields,
    };
  }

  static convertMediaUploadProviderMethod(uploadMethod: MediaUploadProviderMethod): MediaPresignedUrlUploadMethod {
    switch (uploadMethod) {
      case 'POST': {
        return MediaPresignedUrlUploadMethod.POST;
      }

      case 'PUT': {
        return MediaPresignedUrlUploadMethod.PUT;
      }

      default: {
        throw new NotImplementedException(
          `Unknown media upload provider method ${uploadMethod}.`,
          'MEDIA_PRESIGNED_URL_UNKNOWN_UPLOAD_METHOD',
        );
      }
    }
  }
}
