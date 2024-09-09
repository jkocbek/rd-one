import { Inject, Injectable, Logger } from '@nestjs/common';

import { NotFoundException } from '~common/exceptions';
import { IPaginatedList } from '~common/interfaces/paginated-list.interface';
import { IPaginatedListQuery } from '~common/interfaces/paginated-list.query.interface';

import { IUserSessionCreate } from './interfaces/user-session.create.interface';
import { IUserSessionFilter } from './interfaces/user-session.filter.interface';
import { IUserSession } from './interfaces/user-session.interface';
import { IUserSessionUpdate } from './interfaces/user-session.update.interface';
import { UserSessionRepository } from './user-session.repository';

@Injectable()
export class UserSessionService {
  static readonly LOGGER_KEY = 'user-session-service-logger';

  constructor(
    @Inject(UserSessionService.LOGGER_KEY)
    private readonly logger: Logger,
    private readonly userSessionRepository: UserSessionRepository,
  ) {}

  async listForUser(
    userId: string,
    query: IPaginatedListQuery<IUserSessionFilter>,
  ): Promise<IPaginatedList<IUserSession, IUserSessionFilter>> {
    const userSessions = await this.userSessionRepository.listForUser(userId, query);
    return userSessions;
  }

  async findForUserById(userId: string, id: string): Promise<IUserSession | undefined> {
    const userSession = await this.userSessionRepository.findForUserById(userId, id);
    return userSession;
  }

  async findForUserByIdOrThrow(userId: string, id: string): Promise<IUserSession> {
    const userSession = await this.userSessionRepository.findForUserById(userId, id);

    if (!userSession) {
      this.logger.warn(`Could not found user session ${id} by id for user ${userId}.`);
      throw new NotFoundException('User session not found.', 'USER_SESSION_USERS_NOT_FOUND');
    }

    return userSession;
  }

  async findForUserByJti(userId: string, jti: string): Promise<IUserSession | undefined> {
    const userSession = await this.userSessionRepository.findForUserByJti(userId, jti);
    return userSession;
  }

  async create(data: IUserSessionCreate): Promise<IUserSession> {
    const userSession = await this.userSessionRepository.create(data);
    return userSession;
  }

  async updateById(id: string, data: IUserSessionUpdate): Promise<IUserSession> {
    const userSession = await this.userSessionRepository.updateById(id, data);
    return userSession;
  }

  async deleteForUserById(userId: string, id: string): Promise<void> {
    await this.userSessionRepository.deleteForUserById(userId, id);
  }

  async deleteAllForUser(userId: string): Promise<void> {
    await this.userSessionRepository.deleteAllForUser(userId);
  }
}
