import { LogLevel } from '@nestjs/common';
import { Expose } from 'class-transformer';
import { IsEnum, IsObject, IsString } from 'class-validator';

import { ConfigDecorator } from '~common/config';

enum LogLevelEnum {
  'log' = 'log',
  'error' = 'error',
  'warn' = 'warn',
  'debug' = 'debug',
  'verbose' = 'verbose',
}

/**
 * Logger configuration used throughout the app
 *  the level defines the output printed to the console
 *  hooks can capture errors that are not printed
 */
@ConfigDecorator('logger')
export class LoggerConfig {
  /**
   * Type of logger to use locally
   *  - do not use console in AWS !
   */
  @Expose()
  @IsString()
  output: 'json' | 'console' = 'json';

  /**
   * Default log level for all unspecified contexts
   *  logs the selected severity and above
   */
  @Expose()
  @IsEnum(LogLevelEnum)
  level?: LogLevel = 'log';

  /**
   * Configure per context logging
   * @example "UserService: warn" - log warnings and higher for the UserService context
   */
  @Expose()
  @IsObject()
  contexts?: Record<string, LogLevelEnum>;
}
