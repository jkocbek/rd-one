/* eslint-disable @typescript-eslint/ban-types */

import { EmailType } from '../enums/email.type.enum';

export type EmailTemplateVariables = {
  [EmailType.FORGOT_PASSWORD]: { frontendUrl: string; code: string; expireAt: Date };
  [EmailType.RESET_PASSWORD_SUCCESS]: {};
  [EmailType.POST_DELETED]: { postOwnerName: string; postTitle: string; deletionComment: string };
};
