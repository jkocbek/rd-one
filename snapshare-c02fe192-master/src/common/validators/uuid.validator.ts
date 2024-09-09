import { ParseUUIDPipe } from '@nestjs/common';

import { appConstants } from '~modules/app/app.constants';

export const UuidValidator = new ParseUUIDPipe({ version: appConstants.uuid.version });
