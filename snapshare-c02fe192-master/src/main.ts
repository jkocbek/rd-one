import 'reflect-metadata';

import { NestFactory } from '@nestjs/core';

import { getConfig } from '~common/config';
import { corsSetup } from '~common/http/cors.helper';
import { HttpConfig } from '~common/http/http.config';
import { logger } from '~common/logging';
import { swaggerSetup } from '~common/swagger/swagger.helper';

import { AppModule } from '~modules/app/app.module';
import { globalPipes } from '~modules/app/app.pipes';

const httpConfig = getConfig(HttpConfig);

/**
 * Main application bootstrap
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
    abortOnError: false, // force nest.js to bubble up exceptions
  });

  app.enableShutdownHooks();

  // set global prefix
  app.setGlobalPrefix(httpConfig.prefix);

  // setup CORS
  corsSetup(app);

  // pipes (reused in tests)
  globalPipes(app);

  // swagger
  swaggerSetup(app);

  // TODO: Add adminjs

  // TODO: Add queue workers

  const port = httpConfig.port;
  await app.listen(port);
  logger.log(`Server started on port ${port}`, 'Bootstrap');
}

bootstrap().catch((e) => {
  logger.error(e.message, e, 'Bootstrap');
  process.exit(1);
});
