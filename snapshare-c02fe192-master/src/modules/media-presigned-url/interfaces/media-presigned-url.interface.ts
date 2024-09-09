import { MediaPresignedUrlUploadMethod } from '../enums/media-presigned-url.upload-method.enum';

export interface IMediaPresignedUrl {
  mediaUrl: string;
  uploadMethod: MediaPresignedUrlUploadMethod;
  uploadUrl: string;
  fields?: Record<string, string>;
}
