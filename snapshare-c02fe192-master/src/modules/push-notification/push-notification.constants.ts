import { PushNotificationType } from './enums/push-notification.type.enum';
import { IPushNotificationMessageTemplate } from './interfaces/push-notification.message-template.interface';

// TODO: This can/should be moved into database and make it work similar to emails (store title, body, etc. in database instead of hardcoding it)
export const pushNotificationTemplates: {
  [key in PushNotificationType]: IPushNotificationMessageTemplate;
} = {
  POST_CREATED: { title: 'New Post Created', body: 'Your friend {{senderName}} has created a new post.' },
  POST_DELETED: { title: 'Post Deleted', body: 'A post has been deleted.' },
  UNFRIENDED: { title: 'You have been unfriended', body: '{{unfrienderName}} has unfriended you.' },
};
