import { getConfig } from '~common/config';
import { LoggerConfig } from '~common/logging/logger.config';

import { JsonLogger } from './json.logger';
import { NiceLogger } from './nice.logger';

const loggerConfig = getConfig(LoggerConfig);

export const logger =
  loggerConfig.output === 'console'
    ? // Local development
      new NiceLogger(undefined)
    : // Deployment and metrics
      new JsonLogger(undefined);
