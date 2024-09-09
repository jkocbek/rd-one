import { Inject, Injectable, Logger } from '@nestjs/common';

import { NotFoundException } from '~common/exceptions';

import { UserService } from '~modules/user/user.service';

import { IUserMe } from './interfaces/user-me.interface';
import { UserMeHelper } from './user-me.helper';

@Injectable()
export class UserMeService {
  static readonly LOGGER_KEY = 'user-me-service-logger';

  constructor(
    @Inject(UserMeService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly userService: UserService,
  ) {}

  async findMeById(id: string): Promise<IUserMe> {
    const user = await this.userService.findById(id);

    if (!user) {
      this.logger.warn(`Could not found user me by id ${id}.`);
      throw new NotFoundException('Could not find me as user.', 'USER_ME_NOT_FOUND');
    }

    return UserMeHelper.fromIUser(user);
  }
}
