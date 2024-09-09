import { MediaStatus } from '../enums/media.status.enum';
import { MediaUse } from '../enums/media.use.enum';

export interface IMediaCreate {
  objectKey: string;
  url: string;
  status: MediaStatus;
  use: MediaUse;
  userId: string;
  mimeType?: string;
}
