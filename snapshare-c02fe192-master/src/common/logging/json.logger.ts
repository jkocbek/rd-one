import { LogLevel } from '@nestjs/common';

import { BaseLogger, LoggerData, LoggerLevelValue } from './base.logger';

/**
 * Simple JSON logger
 *  - used best in AWS CloudWatch
 */
export class JsonLogger extends BaseLogger {
  private print(data: LoggerData) {
    const severity = data.severity || 'error';
    if (this.canLog(severity, data.context)) {
      process[LoggerLevelValue[severity] >= LoggerLevelValue.warn ? 'stderr' : 'stdout'].write(
        JSON.stringify(data) + '\n',
      );
    }
    return data;
  }

  public error(message: any, stack?: string | Error, context?: string, ...optionalParams: any[]) {
    return this.print(super.error(message, stack, context, ...optionalParams));
  }

  public debug(message: any, ...optionalParams: any[]) {
    return this.print(super.debug(message, ...optionalParams));
  }

  public log(message: any, ...optionalParams: any[]) {
    return this.print(super.log(message, ...optionalParams));
  }

  public verbose(message: any, ...optionalParams: any[]) {
    return this.print(super.verbose(message, ...optionalParams));
  }

  public warn(message: any, ...optionalParams: any[]) {
    return this.print(super.warn(message, ...optionalParams));
  }

  public extra(data: {
    context: string;
    severity: LogLevel;
    message?: string;
    extra?: Record<string, any>;
    error?: Error;
  }) {
    return this.print(super.extra(data));
  }
}
