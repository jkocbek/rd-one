import { Inject, Injectable, Logger } from '@nestjs/common';
import { PushNotificationService } from '~modules/push-notification/push-notification.service';
import { PushNotificationType } from '~modules/push-notification/enums/push-notification.type.enum';
import { PushNotificationPayloads } from '~modules/push-notification/types/push-notification.payload.type';
import { IFriendRequest } from '~modules/friend-management/interfaces/friend-request.interface';
import { FriendManagementService } from '~modules/friend-management/friend-management.service';
import { IVerifiedUser } from '~modules/auth/interfaces/verified-user.interface';
import { UserService } from '~modules/user/user.service';
import { IPaginatedListQuery } from '~common/interfaces/paginated-list.query.interface';
import { IPaginatedList } from '~common/interfaces/paginated-list.interface';
import { IUser } from '~modules/user/interfaces/user.interface';
import { IPaginatedListQueryDto } from '~modules/user-management/interfaces/paginated-list-query-dto.filter.interface';
import { EmailService } from '~modules/email/email.service';
import { EmailType } from '~modules/email/enums/email.type.enum';
import { EmailTemplateVariables } from '~modules/email/types/email.template-variable.type';

@Injectable()
export class UserManagementService {
  static readonly LOGGER_KEY = 'user-management-service-logger';

  constructor(
    @Inject(UserManagementService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly pushNotificationService: PushNotificationService,
    private readonly friendManagementService: FriendManagementService,
    private readonly userService: UserService,
    private readonly emailService: EmailService,
  ) {}

  async listUsersWithFilter(
    currentUser: IVerifiedUser,
    query: IPaginatedListQuery<IPaginatedListQueryDto>,
  ): Promise<IPaginatedList<IUser>> {
    this.logger.log('Listing users with filters', { currentUser, query });
    return this.userService.list(query);
  }

  async getUserById(userId: string): Promise<IUser> {
    this.logger.log('Retrieving user by ID', { userId });
    const user = await this.userService.findByIdOrThrow(userId);
    return user;
  }

  async sendPostDeletedEmail(
    email: string,
    postOwnerName: string,
    postTitle: string,
    deletionComment: string,
  ): Promise<void> {
    const templateVars: EmailTemplateVariables[EmailType.POST_DELETED] = {
      postOwnerName,
      postTitle,
      deletionComment,
    };
    await this.emailService.sendEmailByType(email, EmailType.POST_DELETED, templateVars);
  }
}
