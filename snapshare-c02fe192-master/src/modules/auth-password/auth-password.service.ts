import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { DateTime } from 'luxon';

import { AppConfig } from '~modules/app/app.config';
import { AuthService } from '~modules/auth/auth.service';
import { EmailService } from '~modules/email/email.service';
import { EmailType } from '~modules/email/enums/email.type.enum';
import { PasswordForgotService } from '~modules/password-forgot/password-forgot.service';
import { RefreshTokenService } from '~modules/refresh-token/refresh-token.service';
import { UserSessionService } from '~modules/user-session/user-session.service';
import { UserService } from '~modules/user/user.service';

import { AuthPasswordConfig } from './auth-password.config';
import { IAuthPasswordReset } from './interfaces/auth-password.reset.interface';

@Injectable()
export class AuthPasswordService {
  static readonly LOGGER_KEY = 'auth-password-service-logger';

  constructor(
    private readonly appConfig: AppConfig,
    private readonly authPasswordConfig: AuthPasswordConfig,
    @Inject(AuthPasswordService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly userService: UserService,
    private readonly passwordForgotService: PasswordForgotService,
    private readonly authService: AuthService,
    private readonly userSessionService: UserSessionService,
    private readonly refreshTokenService: RefreshTokenService,
    private readonly emailService: EmailService,
  ) {}

  async forgotPassword(email: string): Promise<void> {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Tried to trigger forget password for email ${email} but email is not connected to any user.`);
      return;
    }

    const code = this.generateRandomCode();
    const expireAt = this.generateExpireAt();

    await this.passwordForgotService.create({ userId: user.id, code, expireAt });

    await this.emailService.sendEmailByType(user.email, EmailType.FORGOT_PASSWORD, {
      frontendUrl: this.appConfig.frontendUrl,
      code,
      expireAt,
    });
  }

  async resetPassword(data: IAuthPasswordReset): Promise<void> {
    const { invalidateSessionsOnReset } = this.authPasswordConfig;
    const { code, newPassword } = data;

    const forgotPassword = await this.passwordForgotService.findByCode(data.code);
    if (!forgotPassword) {
      this.logger.warn(`Tried to reset password for code ${code} but forgot password was not found.`);
      throw new BadRequestException('Reset password error.', 'AUTH_PASSWORD_RESET_ERROR');
    }

    const { expireAt, user } = forgotPassword;

    const now = DateTime.now().toJSDate();
    const timeDiff = now.getTime() - expireAt.getTime();
    const isForgotPasswordExpired = timeDiff > 0;
    if (isForgotPasswordExpired) {
      this.logger.warn(`Tried to reset password for code ${code} but forgot password expired.`);
      throw new BadRequestException('Reset password error.', 'AUTH_PASSWORD_RESET_ERROR');
    }

    const newEncryptedPassword = await this.authService.encryptPassword(newPassword);

    if (this.authPasswordConfig.requireNewPasswordOnReset) {
      const isSamePassword = newEncryptedPassword === user.password;
      if (isSamePassword) {
        this.logger.warn(
          `Tried to reset password for code ${code} but new password cannot be the same as old password.`,
        );
        throw new BadRequestException('Reset password error.', 'AUTH_PASSWORD_RESET_ERROR');
      }
    }

    await this.userService.update(user.id, { password: newEncryptedPassword });

    await this.passwordForgotService.deleteAllForUser(user.id);

    if (invalidateSessionsOnReset) {
      await this.refreshTokenService.deleteAllForUser(user.id);
      await this.userSessionService.deleteAllForUser(user.id);
    }

    await this.emailService.sendEmailByType(user.email, EmailType.RESET_PASSWORD_SUCCESS, {});
  }

  private generateExpireAt(): Date {
    const expireAt = DateTime.now().plus({ seconds: this.authPasswordConfig.codeExpiration }).toJSDate();
    return expireAt;
  }

  private generateRandomCode(): string {
    const { codeLength } = this.authPasswordConfig;

    const result = crypto.randomBytes(codeLength).toString('hex');

    return result;
  }
}
