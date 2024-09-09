import { LoggerService, LogLevel, Optional } from '@nestjs/common';

import { getConfig } from '~common/config';
import { BaseExceptionAbstract } from '~common/exceptions';
import { HttpRequestContext } from '~common/http/request-handler.helper';
import { LoggerConfig } from '~common/logging/logger.config';

/**
 * Errors range by severity, each encompassing the previous one
 */

const loggerConfig = getConfig(LoggerConfig);

export const LoggerLevelValue: Record<LogLevel, number> = {
  fatal: 0,
  error: 1,
  warn: 2,
  log: 3,
  debug: 4,
  verbose: 5,
};

export interface LoggerHookContext {
  error?: Error;
}

export interface LoggerData {
  pid: number;
  context?: string;
  message?: string;
  severity?: LogLevel;
  stack?: string;
  error?: any;
  optionalParams?: any[];
  requestId?: string;
  extra?: Record<string, any>;
}

export class BaseLogger implements LoggerService {
  public logLevel: number;
  public contextLogLevels: Record<string, number> = {};

  constructor(
    @Optional()
    protected context: string | undefined,
  ) {
    this.logLevel = LoggerLevelValue[loggerConfig.level || 'debug'];
    if (loggerConfig.contexts) {
      for (const [n, l] of Object.entries(loggerConfig.contexts)) {
        this.contextLogLevels[n] = LoggerLevelValue[l];
      }
    }
  }

  private hooks: Record<string, Array<(input: any, context?: LoggerHookContext) => any>> = {};

  public addHook(name: string, func: (input: any, context?: LoggerHookContext) => any) {
    this.hooks[name] = [...(this.hooks[name] || []), func];
  }

  protected canLog(severity: LogLevel, context?: string) {
    // get log level of context or use the default level
    const minLevel = context && context in this.contextLogLevels ? this.contextLogLevels[context] : this.logLevel;
    return minLevel >= LoggerLevelValue[severity];
  }

  private runHook(input: LoggerData, context?: LoggerHookContext) {
    let data = input;
    if (data?.severity) {
      const { severity } = data;
      if (severity in this.hooks) {
        for (const func of this.hooks[severity]) {
          data = func(data, context);
        }
      }
    }
    return data;
  }

  public error(message: any, stack?: string, context?: string): LoggerData;
  public error(message: any, ...optionalParams: [...any, string?, string?]): LoggerData;
  public error(message: any, stack?: string | Error, context?: string, ...optionalParams: any[]): LoggerData {
    const data = this.parseSimple('error', message, optionalParams, context);
    data.stack = stack instanceof Error ? stack.stack : stack;

    // typeorm query exception
    // todo move into hook
    if (stack instanceof Error && stack.name === 'QueryFailedError') {
      const queryFailedError = stack as any;
      data.extra = {
        driverError: queryFailedError.driverError,
        query: queryFailedError.query,
        parameters: queryFailedError.parameters,
      };
    }

    return this.runHook(data, {
      error: stack instanceof Error ? stack : undefined,
    });
  }

  public extra(input: {
    context: string;
    severity: LogLevel;
    message?: string;
    extra?: Record<string, any>;
    error?: Error;
  }) {
    const { message, context, severity, extra, error } = input;
    const data = this.parseSimple(severity, message, undefined, context);

    data.extra = extra;
    if (error) {
      data.stack = error.stack;
      if (error instanceof BaseExceptionAbstract) {
        data.error = error.toJSON();
      }
    }

    return this.runHook(data, { error });
  }

  public debug(message: any, context?: string): LoggerData;
  public debug(message: any, ...optionalParams: [...any, string?]): LoggerData;
  public debug(message: any, ...optionalParams: any[]): LoggerData {
    return this.runHook(this.parseSimple('debug', message, optionalParams));
  }

  public log(message: any, context?: string): LoggerData;
  public log(message: any, ...optionalParams: [...any, string?]): LoggerData;
  public log(message: any, ...optionalParams: any[]): LoggerData {
    return this.runHook(this.parseSimple('log', message, optionalParams));
  }

  public verbose(message: any, context?: string): LoggerData;
  public verbose(message: any, ...optionalParams: [...any, string?]): LoggerData;
  public verbose(message: any, ...optionalParams: any[]): LoggerData {
    return this.runHook(this.parseSimple('verbose', message, optionalParams));
  }

  public warn(message: any, context?: string): LoggerData;
  public warn(message: any, ...optionalParams: [...any, string?]): LoggerData;
  public warn(message: any, ...optionalParams: any[]): LoggerData {
    return this.runHook(this.parseSimple('warn', message, optionalParams));
  }

  private parseSimple(severity: LogLevel, message?: any, optionalParams?: any[], context?: string): LoggerData {
    const data: LoggerData = {
      pid: process.pid,
      message,
      severity: severity,
      context,
    };

    if (optionalParams && optionalParams.length > 0) {
      const lastItem = optionalParams[optionalParams.length - 1];
      if (typeof lastItem === 'string') {
        data.context = lastItem;
        if (optionalParams.length > 1) {
          data.optionalParams = optionalParams.slice(0, optionalParams.length - 1);
        }
      } else {
        data.optionalParams = optionalParams;
      }
    } else {
      data.optionalParams = undefined;
    }

    // http requestId
    const ctx = HttpRequestContext();
    if (ctx) {
      data.requestId = ctx.requestId;
    }

    return data;
  }
}
