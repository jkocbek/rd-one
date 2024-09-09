import { Inject, Injectable, Logger } from '@nestjs/common';

import { NotFoundException } from '~common/exceptions';
import { IPaginatedList } from '~common/interfaces/paginated-list.interface';
import { IPaginatedListQuery } from '~common/interfaces/paginated-list.query.interface';

import { IUserCreate } from './interfaces/user.create.interface';
import { IUserFilter } from './interfaces/user.filter.interface';
import { IUser } from './interfaces/user.interface';
import { IUserUpdate } from './interfaces/user.update.interface';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  static readonly LOGGER_KEY = 'user-service-logger';

  constructor(
    @Inject(UserService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly userRepository: UserRepository,
  ) {}

  async list(query: IPaginatedListQuery<IUserFilter>): Promise<IPaginatedList<IUser, IUserFilter>> {
    const users = await this.userRepository.list(query);
    return users;
  }

  async findById(id: string): Promise<IUser | undefined> {
    const user = await this.userRepository.findById(id);
    return user;
  }

  async findByIdOrThrow(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      this.logger.warn(`Could not found user ${id} by id.`);
      throw new NotFoundException('User not found.', 'USER_NOT_FOUND');
    }

    return user;
  }

  async findByEmail(email: string): Promise<IUser | undefined> {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async create(data: IUserCreate): Promise<IUser> {
    const user = await this.userRepository.create(data);
    return user;
  }

  async update(userId: string, data: IUserUpdate): Promise<IUser> {
    const user = await this.userRepository.update(userId, data);
    return user;
  }
}
