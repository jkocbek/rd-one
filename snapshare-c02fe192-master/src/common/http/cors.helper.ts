import { INestApplication } from '@nestjs/common';

import { getConfig } from '~common/config';
import { HttpConfig } from '~common/http/http.config';

const httpConfig = getConfig(HttpConfig);

export function corsSetup(app: INestApplication) {
  const { maxAge: corsMaxAge, all: corsAll, url: corsUrl } = httpConfig.cors;

  app.enableCors({
    maxAge: corsMaxAge,
    // Configures the Access-Control-Allow-Credentials CORS header.
    credentials: true,
    origin: corsUrl
      ? corsUrl
      : (origin, callback) => {
          callback(null, corsAll);
        },
  });
}
