import { IMediaUploadProviderGeneratePresignedUrlOptions } from './interfaces/media-upload-provider.generate-presigned-url-options.interface';
import { IMediaUploadProviderPresignedUrlData } from './interfaces/media-upload-provider.presigned-url.data';

export abstract class MediaUploadProviderService {
  abstract generatePresignedUrlData(
    key: string,
    options?: IMediaUploadProviderGeneratePresignedUrlOptions,
  ): Promise<IMediaUploadProviderPresignedUrlData>;

  abstract getObjectMimeType(input: string): Promise<string | undefined>;
}
