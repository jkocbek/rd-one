import { Injectable } from '@nestjs/common';

import { AppConfig } from './app.config';
import { IApiStatus } from './interfaces/api-status.interface';

@Injectable()
export class AppService {
  constructor(private appConfig: AppConfig) {}

  getStatus(): IApiStatus {
    const uptime = process.uptime();
    const d = Math.floor(uptime / (3600 * 24));
    const h = Math.floor((uptime % (3600 * 24)) / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    const humanReadableUptime = `${d}d ${h}h ${m}m ${s}s`;

    return {
      uptime: humanReadableUptime,
      stage: this.appConfig.stage,
      release: this.appConfig.release,
      version: this.appConfig.version,
      buildTime: this.appConfig.buildTime,
    };
  }
}
