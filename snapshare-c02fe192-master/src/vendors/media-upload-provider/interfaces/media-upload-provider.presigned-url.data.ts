import { MediaUploadProviderMethod } from '../types/media-upload-provider.method.type';

export interface IMediaUploadProviderPresignedUrlData {
  mediaUrl: string;
  uploadMethod: MediaUploadProviderMethod;
  uploadUrl: string;
  fields?: Record<string, string>;
}
