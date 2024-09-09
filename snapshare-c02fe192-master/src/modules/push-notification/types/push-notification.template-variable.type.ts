import { PushNotificationType } from '../enums/push-notification.type.enum';

export type PushNotificationTemplateVariables = {
  [PushNotificationType.POST_CREATED]: {
    senderName: string; // Name of the user who created the post
  };
  [PushNotificationType.POST_DELETED]: {};
  [PushNotificationType.UNFRIENDED]: {
    unfrienderName: string; // Name of the user who unfriended
  };
};
