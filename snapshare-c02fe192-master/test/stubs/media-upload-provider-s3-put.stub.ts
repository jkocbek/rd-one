import { IMediaUploadProviderPresignedUrlData } from '~vendors/media-upload-provider/interfaces/media-upload-provider.presigned-url.data';

import { MediaPresignedUrlUploadMethod } from '~modules/media-presigned-url/enums/media-presigned-url.upload-method.enum';

export const mediaPresignedUrlPutStub: Partial<IMediaUploadProviderPresignedUrlData> = {
  mediaUrl: 'http://example.com?mediaPath=true',
  uploadMethod: MediaPresignedUrlUploadMethod.PUT,
  uploadUrl: 'http://example.com?uploadPath=true',
  fields: {},
};
