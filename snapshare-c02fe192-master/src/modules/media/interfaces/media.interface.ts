import { MediaStatus } from '../enums/media.status.enum';
import { MediaUse } from '../enums/media.use.enum';

export interface IMedia {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  objectKey: string;
  url: string;
  status: MediaStatus;
  use: MediaUse;
  mimeType?: string;
  userId: string;
}
