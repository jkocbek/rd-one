import { IPushNotificationProviderResponseFailToken } from './push-notification-provider.response.fail-token.interface';
import { IPushNotificationProviderResponseSuccessToken } from './push-notification-provider.response.success-token.interface';

export interface IPushNotificationProviderResponse {
  successTokens: IPushNotificationProviderResponseSuccessToken[];
  failedTokens: IPushNotificationProviderResponseFailToken[];
}
