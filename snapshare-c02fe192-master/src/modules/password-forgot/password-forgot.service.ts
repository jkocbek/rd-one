import { Injectable } from '@nestjs/common';

import { IPasswordForgotCreate } from './interfaces/password-forgot.create.interface';
import { IPasswordForgot } from './interfaces/password-forgot.interface';
import { PasswordForgotRepository } from './password-forgot.repository';

@Injectable()
export class PasswordForgotService {
  constructor(private readonly passwordForgotRepository: PasswordForgotRepository) {}

  async create(data: IPasswordForgotCreate): Promise<void> {
    await this.passwordForgotRepository.create(data);
  }

  async findByCode(code: string): Promise<IPasswordForgot | undefined> {
    const forgotPassword = await this.passwordForgotRepository.findByCode(code);
    return forgotPassword;
  }

  async deleteById(id: string): Promise<void> {
    await this.passwordForgotRepository.deleteById(id);
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.passwordForgotRepository.deleteAllForUser(userId);
  }
}
