import { PushNotificationType } from '../enums/push-notification.type.enum';

export type PushNotificationPayloads = {
  [PushNotificationType.POST_CREATED]: {};
  [PushNotificationType.POST_DELETED]: {};
  [PushNotificationType.UNFRIENDED]: {};
};
