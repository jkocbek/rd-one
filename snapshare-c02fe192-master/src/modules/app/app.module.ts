import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { getConfigFactory } from '~common/config';

import { PrismaModule } from '~vendors/prisma/prisma.module';

import { AppConfig } from '~modules/app/app.config';
import { AuthPasswordModule } from '~modules/auth-password/auth-password.module';
import { AuthSocialFacebookModule } from '~modules/auth-social-facebook/auth-social-facebook.module';
import { AuthSocialGoogleModule } from '~modules/auth-social-google/auth-social-google.module';
import { AuthModule } from '~modules/auth/auth.module';
import { AuthenticationMiddleware } from '~modules/auth/middlewares/authentication.middleware';
import { VerificationMiddleware } from '~modules/auth/middlewares/verification.middleware';
import { EmailModule } from '~modules/email/email.module';
import { MediaPresignedUrlModule } from '~modules/media-presigned-url/media-presigned-url.module';
import { PushNotificationTokenModule } from '~modules/push-notification-token/push-notification-token.module';
import { PushNotificationModule } from '~modules/push-notification/push-notification.module';
import { UserIdentityProviderModule } from '~modules/user-identity-provider/user-identity-provider.module';
import { UserMeModule } from '~modules/user-me/user-me.module';
import { UserSessionModule } from '~modules/user-session/user-session.module';
import { UserModule } from '~modules/user/user.module';
import { PhotoSharingModule } from '~modules/photo-sharing/photo-sharing.module';
import { UserManagementModule } from '~modules/user-management/user-management.module';
import { FriendManagementModule } from '~modules/friend-management/friend-management.module';
import { UtilityAuthSocialFacebookModule } from '~modules/utility-auth-social-facebook/utility-auth-social-facebook.module';
import { UtilityAuthSocialGoogleModule } from '~modules/utility-auth-social-google/utility-auth-social-google.module';
import { WebhookMediaValidationModule } from '~modules/webhook-media-validation/webhook-media-validation.module';

import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // global modules
    PrismaModule,
    EmailModule,
    PushNotificationModule,

    // authentication
    UserIdentityProviderModule,
    AuthModule,
    AuthSocialGoogleModule,
    AuthSocialFacebookModule,
    AuthPasswordModule.forRootOptionalAsync(),

    // controller-based modules
    UserModule,
    UserMeModule,
    UserSessionModule,
    PushNotificationTokenModule,
    MediaPresignedUrlModule,
    PhotoSharingModule,
    UserManagementModule,
    FriendManagementModule,

    // utility
    UtilityAuthSocialGoogleModule.forRoot(),
    UtilityAuthSocialFacebookModule.forRoot(),

    // webhooks
    WebhookMediaValidationModule.forRootOptionalAsync(),
  ],
  controllers: [AppController],
  providers: [
    getConfigFactory(AppConfig),
    {
      provide: AuthenticationMiddleware.LOGGER_KEY,
      useValue: new Logger(AuthenticationMiddleware.name),
    },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply().forRoutes().apply(AuthenticationMiddleware, VerificationMiddleware).forRoutes('*');
  }
}
