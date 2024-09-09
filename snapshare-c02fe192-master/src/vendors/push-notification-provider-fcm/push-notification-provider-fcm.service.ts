import { Inject, Injectable, Logger } from '@nestjs/common';
import admin from 'firebase-admin';
import * as handlebars from 'handlebars';

import { IPushNotificationProviderMessageTemplate } from '~vendors/push-notification-provider/interfaces/push-notification-provider.message-template.interface';
import { IPushNotificationProviderResponseFailToken } from '~vendors/push-notification-provider/interfaces/push-notification-provider.response.fail-token.interface';
import { IPushNotificationProviderResponse } from '~vendors/push-notification-provider/interfaces/push-notification-provider.response.interface';
import { IPushNotificationProviderResponseSuccessToken } from '~vendors/push-notification-provider/interfaces/push-notification-provider.response.success-token.interface';
import { PushNotificationProviderService } from '~vendors/push-notification-provider/push-notification-provider.service';

import { PushNotificationProviderFcmConfig } from './push-notification-provider-fcm.config';

@Injectable()
export class PushNotificationProviderFcmService extends PushNotificationProviderService {
  static readonly LOGGER_KEY = 'push-notification-provider-fcm-service-logger';

  constructor(
    private readonly pushNotificationProviderFcmConfig: PushNotificationProviderFcmConfig,
    @Inject(PushNotificationProviderFcmService.LOGGER_KEY)
    private readonly logger: Logger,
  ) {
    super();

    const { setupRequired, clientEmail, privateKey, projectId } = this.pushNotificationProviderFcmConfig;
    const isSetup = clientEmail && privateKey && projectId;

    if (!isSetup) {
      const isClientEmailSet = !!clientEmail;
      const isPrivateKeySet = !!privateKey;
      const isProjectIdSet = !!projectId;

      const missingEnvs: (keyof PushNotificationProviderFcmConfig)[] = [];
      if (!isClientEmailSet) {
        missingEnvs.push('clientEmail');
      }
      if (!isPrivateKeySet) {
        missingEnvs.push('privateKey');
      }
      if (!isProjectIdSet) {
        missingEnvs.push('projectId');
      }
      const missingEnvString = missingEnvs.join(', ');

      if (setupRequired) {
        throw new Error(
          `Push notification provider fcm setup is required. Please ensure all necesarry env. variables are set: ${missingEnvString}.`,
        );
      } else {
        this.logger.warn(
          `Push notification provider fcm setup is optional. Skipping configuration... To enable, please ensure all necesarry env variables are set: ${missingEnvString}.`,
        );
        return;
      }
    }

    this._app = admin.initializeApp({
      credential: admin.credential.cert({
        privateKey,
        projectId,
        clientEmail,
      }),
    });
  }

  private readonly _app?: admin.app.App;

  private get emptyResponse(): IPushNotificationProviderResponse {
    return { failedTokens: [], successTokens: [] };
  }

  async subscribeTokensToTopic(
    registrationTokens: string[],
    topic: string,
  ): Promise<IPushNotificationProviderResponse> {
    if (!this._app) {
      return this.emptyResponse;
    }
    if (registrationTokens.length === 0) {
      return this.emptyResponse;
    }

    const failedTokens: IPushNotificationProviderResponseFailToken[] = [];

    try {
      const response = await this._app.messaging().subscribeToTopic(registrationTokens, topic);

      if (response.failureCount > 0) {
        response.errors.forEach((responseError) => {
          if (responseError.error) {
            const token = registrationTokens[responseError.index];
            failedTokens.push({
              token,
              message: responseError.error.message,
              code: responseError.error.code,
              stack: responseError.error.stack,
            });
          }
        });
      }
    } catch (err) {
      this.logger.error(`Failed subscribing ${registrationTokens.length} tokens to topic ${topic}. Error: `, err);
      throw err;
    }

    const successTokens = this.filterSuccessTokens(registrationTokens, failedTokens);

    return {
      successTokens,
      failedTokens,
    };
  }

  async unsubscribeTokensFromTopic(
    registrationTokens: string[],
    topic: string,
  ): Promise<IPushNotificationProviderResponse> {
    if (!this._app) {
      return this.emptyResponse;
    }
    if (registrationTokens.length === 0) {
      return this.emptyResponse;
    }

    const failedTokens: IPushNotificationProviderResponseFailToken[] = [];

    try {
      const response = await this._app.messaging().unsubscribeFromTopic(registrationTokens, topic);

      if (response.failureCount > 0) {
        response.errors.forEach((responseError) => {
          if (responseError.error) {
            const token = registrationTokens[responseError.index];
            failedTokens.push({
              token,
              message: responseError.error.message,
              code: responseError.error.code,
              stack: responseError.error.stack,
            });
          }
        });
      }
    } catch (err) {
      this.logger.error(`Failed unsubscribing ${registrationTokens.length} tokens from ${topic}, err: `, err);
      throw err;
    }

    const successTokens = this.filterSuccessTokens(registrationTokens, failedTokens);

    return {
      successTokens,
      failedTokens,
    };
  }

  async sendMessageToTopic(topic: string, payload: Record<string, any>): Promise<void> {
    if (!this._app) {
      return;
    }
    try {
      await this._app.messaging().sendToTopic(topic, payload);
    } catch (err) {
      this.logger.error(`Failed sending message with payload ${JSON.stringify(payload)} to topic ${topic}, err: `, err);
      throw err;
    }
  }

  async sendForegroundMessage(
    registrationTokens: string[],
    template: IPushNotificationProviderMessageTemplate,
    templateVars?: Record<string, any>,
    data?: Record<string, any>,
  ): Promise<IPushNotificationProviderResponse> {
    if (!this._app) {
      return this.emptyResponse;
    }
    if (registrationTokens.length === 0) {
      return this.emptyResponse;
    }

    const title = template.title ? this.compileTemplate(template.title, templateVars) : undefined;
    const body = template.body ? this.compileTemplate(template.body, templateVars) : undefined;
    const imageUrl = template.imageUrl ? this.compileTemplate(template.imageUrl, templateVars) : undefined;

    const messages: admin.messaging.MulticastMessage = {
      data,
      tokens: registrationTokens,
      notification: { title, body, imageUrl },
    };

    const response = await this.multicastMessages(registrationTokens, messages);

    return response;
  }

  async sendBackgroundMessage(
    registrationTokens: string[],
    data?: Record<string, any>,
  ): Promise<IPushNotificationProviderResponse> {
    if (!this._app) {
      return this.emptyResponse;
    }
    if (registrationTokens.length === 0) {
      return this.emptyResponse;
    }

    const messages: admin.messaging.MulticastMessage = {
      data,
      tokens: registrationTokens,
    };

    const response = await this.multicastMessages(registrationTokens, messages);

    return response;
  }

  private async multicastMessages(
    registrationTokens: string[],
    messages: admin.messaging.MulticastMessage,
  ): Promise<IPushNotificationProviderResponse> {
    if (!this._app) {
      return this.emptyResponse;
    }

    const failedTokens: IPushNotificationProviderResponseFailToken[] = [];

    try {
      const response = await this._app.messaging().sendEachForMulticast(messages);

      if (response.failureCount > 0) {
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            const token = registrationTokens[idx];
            failedTokens.push({
              token,
              message: resp.error?.message,
              code: resp.error?.code,
              stack: resp.error?.stack,
            });
          }
        });
      }

      this.logger.debug(`${response.successCount} Messages were sent successfully & ${response.failureCount} failed.`);
    } catch (error) {
      this.logger.error(`Error multicasting messages. Err: `, error);
      throw error;
    }

    const successTokens = this.filterSuccessTokens(registrationTokens, failedTokens);

    return {
      successTokens,
      failedTokens,
    };
  }

  private compileTemplate(template: string, templateVars?: Record<string, any>): string {
    if (!templateVars) {
      return template;
    }

    const templateBodyFn = handlebars.compile(template);
    const result = templateBodyFn(templateVars);

    return result;
  }

  private filterSuccessTokens(
    allTokens: string[],
    failedTokens: IPushNotificationProviderResponseFailToken[],
  ): IPushNotificationProviderResponseSuccessToken[] {
    const failedTokenSet = new Set(failedTokens.map((failedToken) => failedToken.token)); // Convert to a Set for efficient lookup
    const successTokens = allTokens
      .filter((token) => !failedTokenSet.has(token))
      .map((token) => {
        const item: IPushNotificationProviderResponseSuccessToken = { token };
        return item;
      });

    return successTokens;
  }
}
