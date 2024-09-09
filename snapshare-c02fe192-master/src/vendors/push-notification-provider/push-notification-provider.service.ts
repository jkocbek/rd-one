import { IPushNotificationProviderMessageTemplate } from './interfaces/push-notification-provider.message-template.interface';
import { IPushNotificationProviderResponse } from './interfaces/push-notification-provider.response.interface';

export abstract class PushNotificationProviderService {
  abstract subscribeTokensToTopic(
    registrationTokens: string[],
    topic: string,
  ): Promise<IPushNotificationProviderResponse>;

  abstract unsubscribeTokensFromTopic(
    registrationTokens: string[],
    topic: string,
  ): Promise<IPushNotificationProviderResponse>;

  abstract sendMessageToTopic(topic: string, payload: Record<string, any>): Promise<void>;

  abstract sendForegroundMessage(
    registrationTokens: string[],
    template: IPushNotificationProviderMessageTemplate,
    templateVars?: Record<string, any>,
    data?: Record<string, any>,
  ): Promise<IPushNotificationProviderResponse>;

  abstract sendBackgroundMessage(
    registrationTokens: string[],
    data?: Record<string, any>,
  ): Promise<IPushNotificationProviderResponse>;
}
