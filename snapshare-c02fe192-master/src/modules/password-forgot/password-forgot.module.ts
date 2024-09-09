import { Module } from '@nestjs/common';

import { PasswordForgotRepository } from './password-forgot.repository';
import { PasswordForgotService } from './password-forgot.service';

@Module({
  providers: [PasswordForgotRepository, PasswordForgotService],
  exports: [PasswordForgotService],
})
export class PasswordForgotModule {}
