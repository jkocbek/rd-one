import { LogLevel } from '@nestjs/common';
import { clc } from '@nestjs/common/utils/cli-colors.util';

import { BaseLogger, LoggerData, LoggerLevelValue } from '~common/logging/base.logger';
import { RequestLogInterface } from '~common/logging/interfaces';

/**
 * Nice Logger used in local development
 *  - do not use in production!
 */
export class NiceLogger extends BaseLogger {
  private print(data: LoggerData) {
    const { context, message, optionalParams, stack, error, pid, extra, requestId, severity: _severity } = data;
    const severity = _severity || 'error';
    if (this.canLog(severity, context)) {
      let output = `[${pid}] ${new Date().toISOString()} [${requestId || '-'}] ${context || '-'} `;

      output += NiceLogger.getColorByLogLevel(severity)(`${severity.padEnd(7)} ${message || ''}`);

      if (typeof context === 'string' && context.startsWith('Http') && extra && Object.entries(extra).length > 0) {
        // print nice request log
        const { requestUrl, responseCode, responseTime, userId, remoteIp } = extra as RequestLogInterface;
        output += `${requestUrl} ${responseCode || '-'} ${responseTime || '-'} ${userId || '-'} ${remoteIp || '-'} \n`;
      } else if (extra?.query) {
        output += `   ${clc.bold(extra.query)}${extra.params ? ` ${clc.yellow(extra.params)}` : ''}\n`;
      } else if (extra) {
        output += `\n${JSON.stringify(extra)} \n`;
      } else {
        output += `\n`;
      }

      if (error) {
        output += `${JSON.stringify(error)} \n`;
      }

      if (stack) {
        output += `${stack} \n`;
      }

      if (optionalParams) {
        output += `${JSON.stringify(optionalParams)} \n`;
      }

      process[LoggerLevelValue[severity] >= LoggerLevelValue.warn ? 'stderr' : 'stdout'].write(output);
    }
    return data;
  }

  private static getColorByLogLevel(severity: LogLevel) {
    switch (severity) {
      case 'debug':
        return clc.magentaBright;
      case 'warn':
        return clc.yellow;
      case 'error':
        return clc.red;
      case 'verbose':
        return clc.cyanBright;
      default:
        return clc.green;
    }
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
