import { MediaUse } from './enums/media.use.enum';
import { IMediaConstraints } from './interfaces/media.constraints.interface';

export const mediaUseConstraints: {
  [key in MediaUse]: IMediaConstraints;
} = {
  PHOTO_UPLOAD: { maxContentLength: 10 * 1024 * 1024, allowedMimeTypes: ['image/*'] }, // 10 MB
};
