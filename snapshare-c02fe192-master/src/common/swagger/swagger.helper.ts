import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as expressBasicAuth from 'express-basic-auth';

import { getConfig } from '~common/config';
import { SwaggerConfig } from '~common/swagger/swagger.config';

import { AppConfig } from '~modules/app/app.config';
import { appConstants } from '~modules/app/app.constants';

const swaggerConfig = getConfig(SwaggerConfig);
const appConfig = getConfig(AppConfig);

/**
 * Default Swagger Configuration
 * @param app
 */
export function swaggerSetup(app: INestApplication) {
  if (swaggerConfig.prefix) {
    const config = new DocumentBuilder()
      .setTitle('Api Documentation')
      .setVersion(appConfig.version)
      .addBearerAuth(
        {
          name: 'Authorization',
          bearerFormat: 'Bearer',
          scheme: 'Bearer',
          type: 'http',
          in: 'Header',
        },
        appConstants.swagger.accessToken,
      )
      .build();

    if (swaggerConfig.username && swaggerConfig.password) {
      app.use(
        `/${swaggerConfig.prefix}`,
        // todo make expressBasicAuth optional
        expressBasicAuth({
          challenge: true,
          users: { [swaggerConfig.username]: swaggerConfig.password },
        }),
      );
    }

    SwaggerModule.setup(swaggerConfig.prefix, app, SwaggerModule.createDocument(app, config), {
      swaggerOptions: {
        persistAuthorization: true,
      },
    });
  }
}
