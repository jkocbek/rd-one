import { Inject, Injectable, Logger } from '@nestjs/common';

import { PushNotificationProviderFcmService } from '~vendors/push-notification-provider-fcm/push-notification-provider-fcm.service';

import { PushNotificationTokenService } from '~modules/push-notification-token/push-notification-token.service';

import { PushNotificationTopic } from './enums/push-notification.topic.enum';
import { PushNotificationType } from './enums/push-notification.type.enum';
import { pushNotificationTemplates } from './push-notification.constants';
import { PushNotificationPayloads } from './types/push-notification.payload.type';
import { PushNotificationTemplateVariables } from './types/push-notification.template-variable.type';

@Injectable()
export class PushNotificationService {
  static readonly LOGGER_KEY = 'push-notification-service-logger';

  constructor(
    @Inject(PushNotificationService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly pushNotificationProviderFcmService: PushNotificationProviderFcmService,
    private readonly pushNotificationTokenService: PushNotificationTokenService,
  ) {}

  async subscribeUserToTopic(userId: string, topic: PushNotificationTopic): Promise<void> {
    const registrationTokens = await this.getRegistrationTokens(userId);
    if (!registrationTokens.length) {
      this.logger.debug(`No registration tokens to subscribe user ${userId} to topic ${topic}.`);
      return;
    }

    const failedTokens: string[] = [];

    try {
      const response = await this.pushNotificationProviderFcmService.subscribeTokensToTopic(registrationTokens, topic);

      if (response.failedTokens.length > 0) {
        response.failedTokens.forEach((failedToken) => {
          failedTokens.push(failedToken.token);
        });
      }
    } catch (err) {
      this.logger.warn(`Error occurred subscribing user ${userId} to topic ${topic}. Err: `, err);
    }

    await this.deletePushNotificationTokens(failedTokens);
  }

  async unsubscribeUserFromTopic(userId: string, topic: PushNotificationTopic): Promise<void> {
    const registrationTokens = await this.getRegistrationTokens(userId);
    if (!registrationTokens.length) {
      this.logger.debug(`No registration tokens to unsubscribe user ${userId} from topic ${topic}.`);
      return;
    }

    const failedTokens: string[] = [];

    try {
      const response = await this.pushNotificationProviderFcmService.unsubscribeTokensFromTopic(
        registrationTokens,
        topic,
      );

      if (response.failedTokens.length > 0) {
        response.failedTokens.map((failedToken) => {
          failedTokens.push(failedToken.token);
        });
      }
    } catch (err) {
      this.logger.warn(`Error occurred unsubscribing user ${userId} from topic ${topic}. Err: `, err);
    }

    await this.deletePushNotificationTokens(failedTokens);
  }

  async sendMessageToTopic<NotificationType extends PushNotificationType>(
    topic: PushNotificationTopic,
    type: NotificationType,
    payload: PushNotificationPayloads[NotificationType],
  ): Promise<void> {
    try {
      const data = this.prepareData(type, payload);
      await this.pushNotificationProviderFcmService.sendMessageToTopic(topic, data);
    } catch (err) {
      this.logger.warn(`Error occurred sending message to topic ${topic}. Err: `, err);
    }
  }

  async sendForegroundMessage<NotificationType extends PushNotificationType>(
    userId: string,
    type: NotificationType,
    templateVars?: PushNotificationTemplateVariables[NotificationType],
    payload?: PushNotificationPayloads[NotificationType],
  ): Promise<void> {
    const registrationTokens = await this.getRegistrationTokens(userId);
    if (!registrationTokens.length) {
      this.logger.debug(`No registration tokens for user ${userId} to send foreground message to.`);
      return;
    }

    const data = this.prepareData(type, payload);
    const template = pushNotificationTemplates[type];

    await this.pushNotificationProviderFcmService.sendForegroundMessage(
      registrationTokens,
      template,
      templateVars,
      data,
    );
  }

  async sendAllForegroundMessage<NotificationType extends PushNotificationType>(
    type: NotificationType,
    templateVars?: PushNotificationTemplateVariables[NotificationType],
    payload?: PushNotificationPayloads[NotificationType],
  ): Promise<void> {
    const registrationTokens = await this.getRegistrationTokens();
    if (!registrationTokens.length) {
      this.logger.debug(`No registration tokens to send all foreground message to.`);
      return;
    }

    const data = this.prepareData(type, payload);
    const template = pushNotificationTemplates[type];

    await this.pushNotificationProviderFcmService.sendForegroundMessage(
      registrationTokens,
      template,
      templateVars,
      data,
    );
  }

  async sendBackgroundMessage<NotificationType extends PushNotificationType>(
    userId: string,
    type: NotificationType,
    payload?: PushNotificationPayloads[NotificationType],
  ): Promise<void> {
    const registrationTokens = await this.getRegistrationTokens(userId);
    if (!registrationTokens.length) {
      this.logger.debug(`No registration tokens for user ${userId} to send background message to.`);
      return;
    }

    const data = this.prepareData(type, payload);

    await this.pushNotificationProviderFcmService.sendBackgroundMessage(registrationTokens, data);
  }

  async sendAllBackgroundMessage<NotificationType extends PushNotificationType>(
    type: NotificationType,
    payload?: PushNotificationPayloads[NotificationType],
  ): Promise<void> {
    const registrationTokens = await this.getRegistrationTokens();
    if (!registrationTokens.length) {
      this.logger.debug('No registration tokens to send all background message to.');
      return;
    }

    const data = this.prepareData(type, payload);

    await this.pushNotificationProviderFcmService.sendBackgroundMessage(registrationTokens, data);
  }

  private prepareData<NotificationType extends PushNotificationType>(
    type: NotificationType,
    payload?: PushNotificationPayloads[NotificationType],
  ): Record<string, any> {
    let data = { type };

    if (payload) {
      data = { ...data, ...payload };
    }

    return data;
  }

  private async getRegistrationTokens(userId?: string): Promise<string[]> {
    const notificationTokens = await this.pushNotificationTokenService.findMany({ userId });

    if (!notificationTokens.length) {
      return [];
    }

    const result = notificationTokens.map((notificationTokens) => notificationTokens.token);

    return result;
  }

  private async deletePushNotificationTokens(tokens: string[]): Promise<void> {
    await this.pushNotificationTokenService.deleteManyByToken(tokens);
  }
}
