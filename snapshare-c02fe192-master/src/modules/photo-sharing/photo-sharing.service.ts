import { Inject, Injectable, Logger } from '@nestjs/common';
import { PostRepository } from '~modules/photo-sharing/post.repository';
import { IPost } from '~modules/photo-sharing/interfaces/post.interface';
import { IPostCreate } from '~modules/photo-sharing/interfaces/post-create.interface';
import { IPostUpdate } from '~modules/photo-sharing/interfaces/post-update.interface';
import { IPostDelete } from '~modules/photo-sharing/interfaces/post-delete.interface';
import { IVerifiedUser } from '~modules/auth/interfaces/verified-user.interface';
import { UserManagementService } from '~modules/user-management/user-management.service';
import { FriendManagementService } from '~modules/friend-management/friend-management.service';
import { PushNotificationService } from '~modules/push-notification/push-notification.service';
import { PushNotificationType } from '~modules/push-notification/enums/push-notification.type.enum';
import { EmailService } from '~modules/email/email.service';
import { EmailType } from '~modules/email/enums/email.type.enum';
import { IPaginatedListQuery } from '~common/interfaces/paginated-list.query.interface';
import { IPaginatedList } from '~common/interfaces/paginated-list.interface';
import { IPaginatedPostsFilter } from '~modules/photo-sharing/interfaces/paginated-posts-filter.interface';
import { INewPost } from '~modules/photo-sharing/interfaces/new-post.interface';
import { IMedia } from '~modules/media/interfaces/media.interface';
import { MediaUse, mediaUseConstraints } from '~modules/media/enums/media.use.enum';
import { v4 as uuidv4, validate as uuidValidate } from 'uuid';

@Injectable()
export class PhotoSharingService {
  static readonly LOGGER_KEY = 'photo-sharing-service-logger';

  constructor(
    @Inject(PhotoSharingService.LOGGER_KEY)
    private readonly logger: Logger,
    @Inject('PostRepository')
    private readonly postRepository: PostRepository,
    private readonly userManagementService: UserManagementService,
    private readonly friendManagementService: FriendManagementService,
    private readonly pushNotificationService: PushNotificationService,
    private readonly emailService: EmailService,
  ) {}

  async createPost(post: IPostCreate): Promise<IPost> {
    return this.postRepository.createPost(post);
  }

  async updatePost(postId: string, postUpdate: IPostUpdate): Promise<IPost> {
    return this.postRepository.updatePost(postId, postUpdate);
  }

  async findPostById(postId: string): Promise<IPost | null> {
    return this.postRepository.findPostById(postId);
  }

  async deletePost(postId: string): Promise<void> {
    return this.postRepository.deletePost(postId);
  }

  async softDeletePost(postId: string, deletionComment: string, currentUser: IVerifiedUser): Promise<IPost> {
    if (!uuidValidate(postId)) {
      throw new Error('Invalid post ID');
    }

    const post = await this.postRepository.findPostById(postId);
    if (!post) {
      throw new Error('Post not found');
    }

    const deletedAt = new Date();
    const softDeletedPost = await this.postRepository.softDeletePost({ id: postId, deletedAt });

    await this.sendSilentPushNotificationToOwnerAndFriends(post.userId);
    await this.sendPostDeletedEmail(post.userId, post.caption, deletionComment);

    return softDeletedPost;
  }

  private async sendSilentPushNotificationToOwnerAndFriends(postOwnerId: string): Promise<void> {
    const friends = await this.friendManagementService.listAllFriends(postOwnerId);
    const recipients = [postOwnerId, ...friends];
    await this.pushNotificationService.sendSilentPushNotification(PushNotificationType.POST_DELETED, recipients);
  }

  private async sendPostDeletedEmail(postOwnerId: string, postTitle: string, deletionComment: string): Promise<void> {
    const postOwner = await this.userManagementService.getUserById(postOwnerId);
    if (!postOwner) {
      throw new Error('Post owner not found');
    }

    await this.emailService.sendEmailByType(postOwner.email, EmailType.POST_DELETED, {
      postOwnerName: postOwner.email,
      postTitle,
      deletionComment,
    });
  }

  async listPosts(
    currentUser: IVerifiedUser,
    query: IPaginatedListQuery<IPaginatedPostsFilter>,
  ): Promise<IPaginatedList<IPost, IPaginatedPostsFilter>> {
    return this.postRepository.listPosts(query);
  }

  async createNewPost(currentUser: IVerifiedUser, newPost: INewPost, media: IMedia): Promise<IPost> {
    this.validateCaption(newPost.caption);
    this.validateMedia(media);

    if (media.use !== MediaUse.PHOTO_UPLOAD) {
      throw new Error('Uploaded file is not a PHOTO_UPLOAD');
    }

    const postCreate: IPostCreate = {
      userId: currentUser.id,
      caption: newPost.caption,
      photoUrl: media.url,
      deletedAt: new Date(0), // default value for non-deleted post
    };

    const createdPost = await this.createPost(postCreate);
    await this.notifyFriendsOfNewPost(currentUser.id);

    return createdPost;
  }

  private validateCaption(caption: string): void {
    if (caption.length > 144) {
      throw new Error('Caption should not exceed 144 characters');
    }
  }

  private validateMedia(media: IMedia): void {
    const constraints = mediaUseConstraints[MediaUse.PHOTO_UPLOAD];
    if (
      media.mimeType &&
      !constraints.allowedMimeTypes?.some((type) => media.mimeType!.startsWith(type.split('/')[0]))
    ) {
      throw new Error('Uploaded file is not an image');
    }
    if (media.status !== 'uploaded') {
      throw new Error('Uploaded file is not in the correct status');
    }
    if (media.url.length > constraints.maxContentLength!) {
      throw new Error('Uploaded file exceeds the maximum allowed size of 10MB');
    }
  }

  private async notifyFriendsOfNewPost(userId: string): Promise<void> {
    const friends = await this.friendManagementService.listAllFriends(userId);
    await this.pushNotificationService.sendSilentPushNotification(PushNotificationType.POST_CREATED, friends);
  }
}